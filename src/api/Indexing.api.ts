import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { Search } from "@/api/Search.api";
import { SiteList } from "@/api/Lists.types";
import { ItemIndexCheck, SampleItem, SiteIndexSettings } from "@/api/Indexing.types";
import { absoluteFromServerRelative } from "@/utils/Url.util";

const STALE_TOLERANCE_MS = 5 * 60 * 1000;

export function Indexing(webUrl?: string): {
  site(): Promise<SiteIndexSettings>;
  indexedCount(list: SiteList): Promise<number>;
  sampleItems(list: SiteList, count: number): Promise<SampleItem[]>;
  checkItem(list: SiteList, item: SampleItem): Promise<ItemIndexCheck>;
  managedProperties(): Promise<string[]>;
} {
  return {
    async site(): Promise<SiteIndexSettings> {
      const web = (await throttled(() => getSp(webUrl).web.select("Url", "Title", "NoCrawl", "SearchScope")(), {
        label: "Indexing.site",
        priority: true,
      })) as { Url: string; Title: string; NoCrawl?: boolean; SearchScope?: number };

      return {
        url: web.Url,
        title: web.Title,
        noCrawl: Boolean(web.NoCrawl),
        searchScope: Number(web.SearchScope ?? 0),
      };
    },

    /** One search call per list gives the indexed item count for that path. */
    async indexedCount(list: SiteList): Promise<number> {
      const path = absoluteUrl(list.serverRelativeUrl, list.siteUrl ?? webUrl);

      const outcome = await Search(webUrl).run({
        queryText: `Path:"${path}"`,
        rowLimit: 1,
        startRow: 0,
        selectProperties: ["Path"],
        trimDuplicates: false,
        enableStemming: false,
        refiners: [],
        refinementFilters: [],
      });

      return outcome.totalRows;
    },

    async sampleItems(list: SiteList, count: number): Promise<SampleItem[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.select("Title", "FileRef", "Modified")
            .orderBy("Modified", false)
            .top(count)(),
        { label: "Indexing.sampleItems" }
      )) as { Title?: string; FileRef?: string; Modified?: string }[];

      return rows.map((row) => ({
        title: row.Title || row.FileRef?.split("/").pop() || "",
        url: absoluteUrl(row.FileRef ?? "", list.siteUrl ?? webUrl),
        modified: row.Modified ?? "",
      }));
    },

    async checkItem(list: SiteList, item: SampleItem): Promise<ItemIndexCheck> {
      const check = await Search(webUrl).isIndexed(item.url);
      const indexedModified = check.row?.LastModifiedTime;

      return {
        siteUrl: list.siteUrl ?? webUrl ?? "",
        listTitle: list.title,
        title: item.title,
        url: item.url,
        itemModified: item.modified,
        indexed: check.indexed,
        indexedModified,
        stale: isStale(item.modified, indexedModified),
      };
    },

    managedProperties(): Promise<string[]> {
      return Search(webUrl).managedProperties();
    },
  };
}

function isStale(itemModified: string, indexedModified?: string): boolean {
  if (!itemModified || !indexedModified) return false;
  return new Date(itemModified).getTime() - new Date(indexedModified).getTime() > STALE_TOLERANCE_MS;
}

function absoluteUrl(serverRelativeUrl: string, siteUrl?: string): string {
  if (!serverRelativeUrl) return "";
  if (/^https?:\/\//i.test(serverRelativeUrl)) return serverRelativeUrl;
  return absoluteFromServerRelative(serverRelativeUrl, siteUrl ?? window.location.href);
}
