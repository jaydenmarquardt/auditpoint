import { SiteLists } from "@/api/Lists.api";
import { Publishing } from "@/api/Publishing.api";
import { ReportDefinition } from "@/core/report/Report.types";
import { PublishingAuditConfig, PublishingAuditData } from "@/modules/publishingAudit/PublishingAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const PUBLISHING_AUDIT_KIND = "publishing-audit";

export const publishingAuditReport: ReportDefinition<PublishingAuditData, PublishingAuditConfig> = {
  kind: PUBLISHING_AUDIT_KIND,
  title: "Publishing and staleness audit",
  description:
    "Reads items with their approval status, authors, editors and version labels, adds review and expiry columns, samples version history and pulls view counts from search.",
  iconName: "PageEdit",
  version: "1.1.0",
  schemaVersion: 1,

  defaultConfig: {
    months: 12,
    staleDays: 365,
    listScope: "all",
    listNames: "",
    includeHidden: false,
    maxLists: 50,
    maxItemsPerList: 5000,
    dateColumns: "ReviewDate,ExpiryDate,ArticleStartDate",
    readVersions: false,
    versionDepth: 50,
    versionSample: 5000,
  },

  configFields: [
    {
      key: "months",
      label: "Timeframe (months)",
      type: "number",
      group: "Thresholds",
      min: 1,
      max: 60,
      step: 1,
      description: "How far back the created and modified charts run.",
    },
    {
      key: "staleDays",
      label: "Stale after (days)",
      type: "number",
      group: "Thresholds",
      min: 30,
      max: 3650,
      step: 30,
      description: "Items not edited inside this window count as stale.",
    },
    {
      key: "listScope",
      label: "Lists to read",
      type: "choice",
      group: "Options",
      options: [
        { key: "all", text: "Every list and library" },
        { key: "pages", text: "Site Pages only" },
        { key: "custom", text: "Only the lists named below" },
      ],
      description: "Publishing state applies to documents and list items as well as pages.",
    },
    {
      key: "listNames",
      showWhen: (config) => config.listScope === "custom",
      label: "List names",
      type: "text",
      group: "Columns and paths",
      multiline: true,
      description: "Comma separated titles, used when the scope is set to named lists.",
    },
    {
      key: "includeHidden",
      label: "Include hidden and system lists",
      type: "toggle",
      group: "What to scan",
      description: "System lists rarely hold published content and add a lot of noise.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      group: "Limits",
      min: 5,
      max: 500,
      step: 5,
      description: "Upper bound on lists read per site.",
    },
    {
      key: "maxItemsPerList",
      label: "Maximum items per list",
      type: "number",
      group: "Limits",
      min: 50,
      max: 5000,
      step: 50,
      description: "Items are read newest change first, so the cap keeps the most relevant ones.",
    },
    {
      key: "dateColumns",
      label: "Extra date columns",
      type: "text",
      group: "Columns and paths",
      multiline: true,
      description: "Comma separated internal names, for example ReviewDate,ExpiryDate. Missing columns are ignored.",
    },
    {
      key: "readVersions",
      label: "Read version history",
      type: "toggle",
      group: "What to scan",
      description: "One request per sampled item. Off still reports the version label held on the item.",
    },
    {
      key: "versionSample",
      label: "Items sampled for versions",
      type: "number",
      group: "Thresholds",
      min: 10,
      max: 5000,
      step: 10,
      description: "How many recently changed items to read version history for.",
    },
    {
      key: "versionDepth",
      label: "Versions read per item",
      type: "number",
      group: "Thresholds",
      min: 5,
      max: 500,
      step: 5,
      description: "How deep to read each item's history.",
    },
    
  ],

  stages: [
    {
      key: "items",
      work: "both",
      label: "Read items",
      async run(context) {
        const columns = context.config.dateColumns
          .split(/[,;\s]+/)
          .map((name) => name.trim())
          .filter(Boolean);

        const named = context.config.listNames
          .split(/[,;]+/)
          .map((name) => name.trim().toLowerCase())
          .filter(Boolean);

        const lists = (await SiteLists(context.siteUrl).getAll(context.config.includeHidden))
          .filter((list) => list.itemCount > 0)
          .filter((list) => {
            if (context.config.listScope === "pages") return list.title === "Site Pages";
            if (context.config.listScope === "custom") return named.indexOf(list.title.toLowerCase()) !== -1;
            return true;
          })
          .slice(0, context.config.maxLists);

        const api = Publishing(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const items = context.data.items ?? [];

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.items = items;
            return;
          }

          try {
            const available = new Set(await api.fieldNames(lists[index]));
            const present = columns.filter((column) => available.has(column));

            items.push(...(await api.items(lists[index], present, context.config.maxItemsPerList)));
          } catch (error) {
            context.issue({
              target: lists[index].title,
              code: statusOf(error) ?? "error",
              message: toErrorMessage(error),
            });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, lists.length);
        }

        context.data.items = items;
        context.data.listCount = (context.data.listCount ?? 0) + lists.length;
        context.log(`${lists.length} lists read, ${items.length} items`);
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
      },
    },
    {
      key: "versions",
      work: "network",
      label: "Read version history",
      async run(context) {
        if (!context.config.readVersions) {
          context.progress(0, 0);
          return;
        }

        const items = (context.data.items ?? []).filter((item) => item.siteUrl === context.siteUrl);
        const sample = [...items]
          .sort((a, b) => b.modified.localeCompare(a.modified))
          .slice(0, context.config.versionSample);

        const api = Publishing(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;

        for (let index = start; index < sample.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            return;
          }

          const item = sample[index];

          try {
            const history = await api.versions(
              { id: item.listId, title: item.listTitle } as never,
              item.itemId,
              context.config.versionDepth
            );

            item.versionCount = history.count;
            item.versionEditors = history.editors;
          } catch (error) {
            context.issue({ target: item.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, sample.length);
        }
      },
    },
        {
      key: "summarise",
      work: "client",
      label: "Summarise",
      async run(context) {
        const items = context.data.items ?? [];
        context.progress(items.length, items.length);
      },
    },
  ],
};

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
