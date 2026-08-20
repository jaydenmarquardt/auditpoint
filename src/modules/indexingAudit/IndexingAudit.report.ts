import { SiteLists } from "@/api/Lists.api";
import { Indexing } from "@/api/Indexing.api";
import { ListIndexCoverage } from "@/api/Indexing.types";
import { ReportDefinition } from "@/core/report/Report.types";
import { IndexingAuditConfig, IndexingAuditData } from "@/modules/indexingAudit/IndexingAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const INDEXING_AUDIT_KIND = "indexing-audit";

export const indexingAuditReport: ReportDefinition<IndexingAuditData, IndexingAuditConfig> = {
  kind: INDEXING_AUDIT_KIND,
  title: "Indexing audit",
  description:
    "Reads crawl settings, compares list item counts with what search returns, spot checks items and lists the managed properties that come back.",
  iconName: "Search",
  version: "1.1.0",
  schemaVersion: 1,

  defaultConfig: {
    includeHidden: false,
    checkCoverage: true,
    checkItems: true,
    itemsPerList: 3,
    readManagedProperties: true,
    maxLists: 200,
    coverageWarningPercent: 90,
  },

  configFields: [
    {
      key: "includeHidden",
      label: "Include hidden and system lists",
      type: "toggle",
      description: "System lists are rarely indexed on purpose, so leaving this off keeps the numbers meaningful.",
    },
    {
      key: "checkCoverage",
      label: "Compare item counts with the index",
      type: "toggle",
      description: "One search request per list asks how many items search holds under that path.",
    },
    {
      key: "checkItems",
      label: "Spot check individual items",
      type: "toggle",
      description: "Runs a Path query per sampled item to prove it is findable and current.",
    },
    {
      key: "itemsPerList",
      label: "Items sampled per list",
      type: "number",
      min: 1,
      max: 5000,
      step: 1,
      description: "One search request per item, newest first. Set it to the list size to check everything, at that cost.",
    },
    {
      key: "readManagedProperties",
      label: "List managed properties returned",
      type: "toggle",
      description: "Reads the properties present on a sample result, which is what search can actually return.",
    },
    {
      key: "coverageWarningPercent",
      label: "Coverage target (%)",
      type: "number",
      min: 10,
      max: 100,
      step: 5,
      description: "Lists indexed below this share of their item count are flagged for review.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      min: 10,
      max: 1000,
      step: 10,
      description: "Upper bound on lists checked per site.",
    },
  ],

  stages: [
    {
      key: "site",
      label: "Read site settings",
      async run(context) {
        const settings = await Indexing(context.siteUrl).site();

        context.data.sites = [...(context.data.sites ?? []), settings];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];

        if (settings.noCrawl) {
          context.issue({ target: context.siteUrl, code: "error", message: "Site is excluded from search results." });
        }

        context.progress(1, 1);
      },
    },
    {
      key: "lists",
      label: "Read lists",
      async run(context) {
        const lists = await SiteLists(context.siteUrl).getAll(context.config.includeHidden);

        const mapped: ListIndexCoverage[] = lists.slice(0, context.config.maxLists).map((list) => ({
          siteUrl: context.siteUrl,
          listId: list.id,
          title: list.title,
          url: list.serverRelativeUrl,
          templateName: list.templateName,
          hidden: list.hidden,
          noCrawl: list.noCrawl,
          hasUniquePermissions: list.hasUniquePermissions,
          itemCount: list.itemCount,
          lastItemModified: list.lastItemModified,
        }));

        context.data.lists = [...(context.data.lists ?? []), ...mapped];
        context.log(`${mapped.filter((list) => list.noCrawl).length} lists are excluded from search`);
        context.progress(mapped.length, mapped.length);
      },
    },
    {
      key: "coverage",
      label: "Compare with the index",
      async run(context) {
        if (!context.config.checkCoverage) {
          context.progress(0, 0);
          return;
        }

        const lists = context.data.lists ?? [];
        const forSite = lists.filter((list) => list.siteUrl === context.siteUrl);
        const api = Indexing(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;

        for (let index = start; index < forSite.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            return;
          }

          const entry = forSite[index];
          const position = lists.indexOf(entry);

          try {
            lists[position] = { ...entry, indexedCount: await api.indexedCount(toSiteList(entry)) };
          } catch (error) {
            lists[position] = { ...entry, error: toErrorMessage(error) };
            context.issue({ target: entry.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, forSite.length);
        }
      },
    },
    {
      key: "items",
      label: "Spot check items",
      async run(context) {
        if (!context.config.checkItems) {
          context.progress(0, 0);
          return;
        }

        const lists = (context.data.lists ?? []).filter(
          (list) => list.siteUrl === context.siteUrl && list.itemCount > 0 && !list.hidden
        );

        const api = Indexing(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const checks = context.data.items ?? [];

        for (let index = start; index < lists.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.items = checks;
            return;
          }

          const list = toSiteList(lists[index]);

          try {
            const sample = await api.sampleItems(list, context.config.itemsPerList);

            for (const item of sample) {
              if (!item.url) continue;
              const check = await api.checkItem(list, item);
              checks.push(check);

              if (!check.indexed) {
                context.issue({ target: item.url, code: "error", message: "Item not found in the search index." });
              }
            }
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

        context.data.items = checks;
      },
    },
    {
      key: "properties",
      label: "Read managed properties",
      async run(context) {
        if (!context.config.readManagedProperties) {
          context.progress(0, 0);
          return;
        }

        try {
          const properties = await Indexing(context.siteUrl).managedProperties();
          const merged = new Set([...(context.data.managedProperties ?? []), ...properties]);
          context.data.managedProperties = [...merged].sort();
          context.progress(properties.length, properties.length);
        } catch (error) {
          context.issue({ target: context.siteUrl, code: "error", message: toErrorMessage(error) });
        }
      },
    },
  ],
};

/** The indexing API works from the shared list shape, so rebuild the parts it uses. */
function toSiteList(entry: ListIndexCoverage): Parameters<ReturnType<typeof Indexing>["indexedCount"]>[0] {
  return {
    id: entry.listId,
    siteUrl: entry.siteUrl,
    title: entry.title,
    description: "",
    kind: "list",
    baseTemplate: 100,
    templateName: entry.templateName,
    itemCount: entry.itemCount,
    hidden: entry.hidden,
    created: "",
    lastItemModified: entry.lastItemModified,
    serverRelativeUrl: entry.url,
    defaultViewUrl: "",
    versioningEnabled: false,
    majorVersionLimit: 0,
    contentTypesEnabled: false,
    hasUniquePermissions: entry.hasUniquePermissions,
    noCrawl: entry.noCrawl,
  };
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
