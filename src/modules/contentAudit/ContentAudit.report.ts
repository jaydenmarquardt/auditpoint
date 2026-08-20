import { SiteLists } from "@/api/Lists.api";
import { PageCanvas } from "@/api/WebParts.api";
import { ContentSource } from "@/api/Content.api";
import { ReportDefinition } from "@/core/report/Report.types";
import { analyseHtml } from "@/modules/contentAudit/ContentAudit.analysis";
import { ContentAuditConfig, ContentAuditData, ContentEntry } from "@/modules/contentAudit/ContentAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const CONTENT_AUDIT_KIND = "content-audit";

export const contentAuditReport: ReportDefinition<ContentAuditData, ContentAuditConfig> = {
  kind: CONTENT_AUDIT_KIND,
  title: "Content audit",
  description:
    "Measures the writing itself: words, paragraphs, headings, images, links, tables and embeds across page canvases and rich text columns such as Body or Description.",
  iconName: "TextDocument",
  version: "1.1.0",
  schemaVersion: 1,

  defaultConfig: {
    maxPages: 5000,
    scanListItems: true,
    columnNames: "Body,PageBody,Description,Comments,Content",
    autoDetectColumns: true,
    maxItemsPerList: 5000,
    maxLists: 100,
    thinWordCount: 120,
  },

  configFields: [
    {
      key: "maxPages",
      label: "Maximum pages per site",
      type: "number",
      min: 10,
      max: 20000,
      step: 50,
      description: "Pages are read in one request, then parsed locally.",
    },
    {
      key: "scanListItems",
      label: "Scan rich text columns on lists",
      type: "toggle",
      description: "Reads list items that carry HTML, such as an event description or a news body.",
    },
    {
      key: "autoDetectColumns",
      label: "Detect rich text columns automatically",
      type: "toggle",
      description: "Looks at each list's fields for multi line and HTML columns instead of relying on names alone.",
    },
    {
      key: "columnNames",
      label: "Column names to include",
      type: "text",
      description: "Comma separated internal names, always checked even when detection is off.",
    },
    {
      key: "maxItemsPerList",
      label: "Maximum items per list",
      type: "number",
      min: 50,
      max: 5000,
      step: 50,
      description: "Caps how many items are read from each list carrying rich text.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      min: 5,
      max: 500,
      step: 5,
      description: "Upper bound on lists inspected for rich text columns.",
    },
    {
      key: "thinWordCount",
      label: "Thin content under (words)",
      type: "number",
      min: 20,
      max: 2000,
      step: 10,
      description: "Content under this word count is flagged as thin.",
    },
  ],

  stages: [
    {
      key: "pages",
      label: "Read and measure pages",
      async run(context) {
        const host = hostOf(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const pages = await PageCanvas(context.siteUrl).getPages(context.config.maxPages);

        const entries: ContentEntry[] = pages.map((page) => ({
          siteUrl: context.siteUrl,
          source: "page",
          listTitle: "Site Pages",
          itemId: page.id,
          column: "CanvasContent1",
          title: page.title,
          url: page.serverRelativeUrl,
          modified: page.modified,
          contentType: page.pageLayout || "Site Page",
          ...analyseHtml(source.pageHtml(page), host),
        }));

        context.data.entries = [...(context.data.entries ?? []), ...entries];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.progress(entries.length, entries.length);
      },
    },
    {
      key: "items",
      label: "Read and measure list content",
      async run(context) {
        if (!context.config.scanListItems) {
          context.progress(0, 0);
          return;
        }

        const host = hostOf(context.siteUrl);
        const source = ContentSource(context.siteUrl);
        const named = context.config.columnNames
          .split(/[,;\s]+/)
          .map((name) => name.trim())
          .filter(Boolean);

        const lists = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.title !== "Site Pages" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const entries = context.data.entries ?? [];
        const columnsSeen = new Set(context.data.columnsScanned ?? []);

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.entries = entries;
            return;
          }

          const list = lists[index];

          try {
            const available = new Set(await source.fieldNames(list));
            const detected = context.config.autoDetectColumns
              ? (await source.richTextColumns(list)).map((column) => column.internalName)
              : [];

            const columns = [...new Set([...named, ...detected])].filter((column) => available.has(column));
            if (columns.length === 0) continue;
            const records = await source.items(list, columns, context.config.maxItemsPerList);

            records.forEach((record) => {
              columnsSeen.add(record.column);
              entries.push({
                siteUrl: record.siteUrl,
                source: "item",
                listTitle: record.listTitle,
                itemId: record.itemId,
                column: record.column,
                title: record.title,
                url: record.url,
                modified: record.modified,
                contentType: record.contentType,
                ...analyseHtml(record.html, host),
              });
            });
          } catch (error) {
            context.issue({ target: list.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, lists.length);
        }

        context.data.entries = entries;
        context.data.columnsScanned = [...columnsSeen];
      },
    },
    {
      key: "summarise",
      label: "Summarise",
      async run(context) {
        const entries = context.data.entries ?? [];
        context.log(`${entries.reduce((sum, entry) => sum + entry.words, 0)} words measured`);
        context.progress(entries.length, entries.length);
      },
    },
  ],
};

function hostOf(siteUrl: string): string {
  try {
    return new URL(siteUrl).host;
  } catch {
    return window.location.host;
  }
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
