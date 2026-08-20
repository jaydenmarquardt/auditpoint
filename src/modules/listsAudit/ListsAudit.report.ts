import { SiteLists } from "@/api/Lists.api";
import { SiteList } from "@/api/Lists.types";
import { ReportDefinition } from "@/core/report/Report.types";
import { ListsAuditConfig, ListsAuditData } from "@/modules/listsAudit/ListsAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const LISTS_AUDIT_KIND = "lists-audit";

const BATCH_SIZE = 20;

export const listsAuditReport: ReportDefinition<ListsAuditData, ListsAuditConfig> = {
  kind: LISTS_AUDIT_KIND,
  title: "Lists and libraries audit",
  description:
    "Inventories every list and library with item, folder and file counts, sizes, file types, content types, versioning and permission flags.",
  iconName: "BulletedList",
  version: "1.2.0",
  schemaVersion: 2,

  defaultConfig: {
    includeHidden: true,
    scanItems: true,
    readContentTypes: true,
    maxItemsPerList: 5000,
    staleDays: 365,
    maxLists: 500,
  },

  configFields: [
    {
      key: "includeHidden",
      label: "Include hidden and system lists",
      type: "toggle",
      description: "Adds catalogs and system lists such as the Master Page Gallery. Off keeps the report to content lists.",
    },
    {
      key: "readContentTypes",
      label: "Read content types",
      type: "toggle",
      description: "One batched request per 20 lists. Off if you only care about sizes and counts.",
    },
    {
      key: "scanItems",
      label: "Scan items for folders, files and sizes",
      type: "toggle",
      description: "Pages every list to count folders and files and sum file sizes. This is the slow part of the run.",
    },
    {
      key: "maxItemsPerList",
      label: "Maximum items scanned per list",
      type: "number",
      min: 100,
      max: 50000,
      step: 100,
      description: "Stops the scan on very large lists. Lists that hit the cap are flagged as partial.",
    },
    {
      key: "staleDays",
      label: "Stale after (days)",
      type: "number",
      min: 30,
      max: 3650,
      step: 30,
      description: "A list with no item changed in this many days counts as stale.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      min: 10,
      max: 2000,
      step: 10,
      description: "Upper bound on lists read per site, in case a site has thousands.",
    },
  ],

  stages: [
    {
      key: "inventory",
      label: "Read lists",
      async run(context) {
        const lists = await SiteLists(context.siteUrl).getAll(context.config.includeHidden);
        const capped = lists
          .slice(0, context.config.maxLists)
          .map((list) => ({ ...list, siteUrl: context.siteUrl }) as SiteList);

        context.data.lists = [...(context.data.lists ?? []), ...capped];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.progress(capped.length, capped.length);
      },
    },
    {
      key: "contentTypes",
      label: "Read content types",
      async run(context) {
        if (!context.config.readContentTypes) {
          context.progress(0, 0);
          return;
        }

        const lists = context.data.lists ?? [];
        const forSite = lists.filter((list) => list.siteUrl === context.siteUrl);
        const api = SiteLists(context.siteUrl);

        // Batched: one request per chunk of lists instead of one per list.
        for (let start = 0; start < forSite.length; start = start + BATCH_SIZE) {
          await context.waitIfPaused();
          if (context.isCancelled()) return;

          const chunk = forSite.slice(start, start + BATCH_SIZE);

          try {
            const byList = await api.contentTypesBulk(chunk);

            byList.forEach((types, id) => {
              const index = lists.findIndex((candidate) => candidate.id === id);
              if (index !== -1) lists[index] = { ...lists[index], contentTypes: types };
            });
          } catch (error) {
            context.issue({
              target: `${chunk.length} lists`,
              code: statusOf(error) ?? "error",
              message: toErrorMessage(error),
            });
          }

          context.progress(Math.min(start + BATCH_SIZE, forSite.length), forSite.length);
        }
      },
    },
    {
      key: "items",
      label: "Scan items",
      async run(context) {
        if (!context.config.scanItems) {
          context.data.storageAvailable = false;
          context.progress(0, 0);
          return;
        }

        let measured = 0;

        await forEachList(context, async (api, list, index, lists) => {
          try {
            context.log(`Scanning ${list.title}`, "debug");
            const scan = await api.scanItems(list, context.config.maxItemsPerList);

            lists[index] = {
              ...list,
              scannedItems: scan.items,
              folderCount: scan.folders,
              fileCount: scan.files,
              storageBytes: scan.bytes,
              extensions: scan.extensions,
              scanTruncated: scan.truncated,
            };

            if (scan.bytes > 0) measured = measured + 1;
          } catch (error) {
            context.issue({ target: list.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }
        });

        context.data.storageAvailable = measured > 0;
      },
    },
    {
      key: "summarise",
      label: "Summarise",
      async run(context) {
        const lists = context.data.lists ?? [];
        context.progress(lists.length, lists.length);
      },
    },
  ],
};

type StageContext = Parameters<(typeof listsAuditReport.stages)[0]["run"]>[0];

/** Shared cursor walk so both scanning stages resume mid-list. */
async function forEachList(
  context: StageContext,
  handler: (
    api: ReturnType<typeof SiteLists>,
    list: SiteList,
    index: number,
    lists: SiteList[]
  ) => Promise<void>
): Promise<void> {
  const lists = context.data.lists ?? [];
  const api = SiteLists(context.siteUrl);
  const start = typeof context.cursor === "number" ? context.cursor : 0;

  for (let index = start; index < lists.length; index = index + 1) {
    await context.waitIfPaused();

    if (context.isCancelled()) {
      context.setCursor(index);
      return;
    }

    if (lists[index].siteUrl === context.siteUrl) await handler(api, lists[index], index, lists);

    context.setCursor(index + 1);
    context.progress(index + 1, lists.length);
  }
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
