import { PageCanvas } from "@/api/WebParts.api";
import { WebPartCatalogue } from "@/api/WebPartCatalogue.api";
import { CatalogueEntry, WebPartInstance } from "@/api/WebParts.types";
import { toErrorMessage } from "@/utils/Guard.util";
import { ReportDefinition } from "@/core/report/Report.types";
import { WebPartAuditConfig, WebPartAuditData } from "@/modules/webPartAudit/WebPartAudit.types";

export const WEBPART_AUDIT_KIND = "webpart-audit";

export const webPartAuditReport: ReportDefinition<WebPartAuditData, WebPartAuditConfig> = {
  kind: WEBPART_AUDIT_KIND,
  title: "Web part audit",
  description: "Reads every page canvas and extracts the web parts used, their placement and their properties.",
  iconName: "Puzzle",
  version: "1.3.0",
  schemaVersion: 2,

  defaultConfig: {
    maxPages: 5000,
    includeTitleArea: true,
    keepProperties: true,
    readCatalogue: true,
  },

  configFields: [
    {
      key: "maxPages",
      label: "Maximum pages per site",
      type: "number",
      group: "Limits",
      min: 10,
      max: 20000,
      step: 100,
      description: "Pages are read in one request, so a high cap is cheap. Parsing is what takes the time.",
    },
    {
      key: "includeTitleArea",
      label: "Include page title area",
      type: "toggle",
      group: "What to scan",
      description: "Counts web parts placed in the banner area as well as the page body.",
    },
    {
      key: "keepProperties",
      label: "Keep full web part properties",
      type: "toggle",
      group: "What to scan",
      description: "Stores every saved property on each instance. Off keeps the report small when pages are complex.",
    },
    {
      key: "readCatalogue",
      label: "Read the web part catalogue for names and icons",
      type: "toggle",
      group: "What to scan",
      description: "Resolves component ids to real names, icons and groups, and finds installed web parts nobody uses.",
    },
  ],

  stages: [
    {
      key: "catalogue",
      work: "network",
      label: "Read web part catalogue",
      async run(context) {
        if (!context.config.readCatalogue) {
          context.progress(0, 0);
          return;
        }

        try {
          const entries = await WebPartCatalogue(context.siteUrl).getAll();
          const existing = context.data.catalogue ?? [];
          const merged = new Map<string, CatalogueEntry>(existing.map((entry) => [entry.id, entry]));
          entries.forEach((entry) => merged.set(entry.id, entry));

          context.data.catalogue = [...merged.values()];
          context.progress(entries.length, entries.length);
        } catch (error) {
          context.issue({ target: context.siteUrl, code: "error", message: toErrorMessage(error) });
        }
      },
    },
    {
      key: "pages",
      work: "both",
      label: "Read pages",
      async run(context) {
        const pages = await PageCanvas(context.siteUrl).getPages(context.config.maxPages);

        context.data.rawPages = [...(context.data.rawPages ?? []), ...pages.map((page) => ({ ...page, siteUrl: context.siteUrl }))];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.progress(pages.length, pages.length);
      },
    },
    {
      key: "canvas",
      work: "network",
      label: "Extract web parts",
      async run(context) {
        const pages = (context.data.rawPages ?? []).filter((page) => page.siteUrl === context.siteUrl);
        const canvas = PageCanvas(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;

        const instances: WebPartInstance[] = context.data.instances ?? [];
        const summaries = context.data.pages ?? [];

        for (let index = start; index < pages.length; index = index + 1) {
          await context.waitIfPaused();

          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.instances = instances;
            context.data.pages = summaries;
            return;
          }

          const page = pages[index];
          const parsed = canvas.parse(page, context.siteUrl, context.config.includeTitleArea);

          if (parsed.parseError) {
            context.issue({ target: page.serverRelativeUrl, code: "error", message: parsed.parseError });
          }

          const catalogue = new Map((context.data.catalogue ?? []).map((entry) => [entry.id, entry]));

          const kept = parsed.instances.map((instance) => {
            const entry = catalogue.get(instance.webPartId);

            return {
              ...instance,
              name: entry?.title || instance.name,
              isOutOfBox: instance.isOutOfBox || Boolean(entry && entry.isInternal),
              isThirdParty: instance.kind === "webPart" && Boolean(entry) && !entry?.isInternal && !instance.isOutOfBox,
              properties: context.config.keepProperties ? instance.properties : {},
            };
          });

          instances.push(...kept);
          summaries.push({
            siteUrl: context.siteUrl,
            pageId: page.id,
            title: page.title,
            url: page.serverRelativeUrl,
            modified: page.modified,
            pageLayout: page.pageLayout,
            webPartCount: parsed.instances.length,
            sections: parsed.sections,
            distinctTypes: new Set(parsed.instances.map((instance) => instance.name)).size,
            parseError: parsed.parseError,
          });

          context.setCursor(index + 1);
          context.progress(index + 1, pages.length);
        }

        context.data.instances = instances;
        context.data.pages = summaries;
      },
    },
    {
      key: "summarise",
      work: "client",
      label: "Summarise",
      async run(context) {
        // Raw canvas HTML is large; drop it once web parts are extracted.
        context.data.rawPages = [];
        context.progress(context.data.instances?.length ?? 0, context.data.instances?.length ?? 0);
      },
    },
  ],
};
