import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { Search } from "@/api/Search.api";
import { SiteList } from "@/api/Lists.types";
import { PopularityRow, PublishingItem } from "@/api/Publishing.types";

const BASE_SELECT = [
  "Id",
  "Title",
  "FileRef",
  "Created",
  "Modified",
  "OData__UIVersionString",
  "OData__ModerationStatus",
  "Author/Title",
  "Editor/Title",
];

interface ItemRow {
  Id: number;
  Title?: string;
  FileRef?: string;
  Created?: string;
  Modified?: string;
  OData__UIVersionString?: string;
  OData__ModerationStatus?: number;
  Author?: { Title?: string };
  Editor?: { Title?: string };
  [key: string]: unknown;
}

export function Publishing(webUrl?: string): {
  fieldNames(list: SiteList): Promise<string[]>;
  items(list: SiteList, dateColumns: string[], top: number): Promise<PublishingItem[]>;
  versions(list: SiteList, itemId: number, depth: number): Promise<{ count: number; editors: string[] }>;
  popularity(rowLimit: number): Promise<PopularityRow[]>;
} {
  const site = webUrl ?? "";

  return {
    async fieldNames(list: SiteList): Promise<string[]> {
      const fields = (await throttled(
        () => getSp(webUrl).web.lists.getById(list.id).fields.select("InternalName")(),
        { label: "Publishing.fields" }
      )) as { InternalName: string }[];

      return fields.map((field) => field.InternalName);
    },

    /** Only columns the list actually has are selected, since one bad name fails the request. */
    async items(list: SiteList, dateColumns: string[], top: number): Promise<PublishingItem[]> {
      const read = async (columns: string[]): Promise<ItemRow[]> =>
        (await throttled(
          () =>
            getSp(webUrl)
              .web.lists.getById(list.id)
              .items.select(...BASE_SELECT, ...columns)
              .expand("Author", "Editor")
              .orderBy("Modified", false)
              .top(top)(),
          { label: "Publishing.items" }
        )) as ItemRow[];

      let rows: ItemRow[];

      try {
        rows = await read(dateColumns);
      } catch {
        rows = await read([]);
      }

      return rows.map((row) => ({
        siteUrl: site,
        listTitle: list.title,
        listId: list.id,
        itemId: row.Id,
        title: String(row.Title ?? row.FileRef?.split("/").pop() ?? row.Id),
        url: String(row.FileRef ?? ""),
        created: String(row.Created ?? ""),
        modified: String(row.Modified ?? ""),
        authorTitle: row.Author?.Title ?? "",
        editorTitle: row.Editor?.Title ?? "",
        moderationStatus: row.OData__ModerationStatus,
        versionLabel: String(row.OData__UIVersionString ?? ""),
        dates: readDates(row, dateColumns),
      }));
    },

    async versions(list: SiteList, itemId: number, depth: number): Promise<{ count: number; editors: string[] }> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.getById(itemId)
            .versions.select("VersionLabel", "Created", "Editor/Title")
            .expand("Editor")
            .top(depth)(),
        { label: "Publishing.versions" }
      )) as { VersionLabel?: string; Editor?: { Title?: string } }[];

      return {
        count: rows.length,
        editors: [...new Set(rows.map((row) => row.Editor?.Title ?? "").filter(Boolean))],
      };
    },

    /** Search carries the view counts that the REST item APIs do not expose. */
    async popularity(rowLimit: number): Promise<PopularityRow[]> {
      const outcome = await Search(webUrl).run({
        queryText: `Path:"${site}"`,
        rowLimit,
        startRow: 0,
        selectProperties: ["Path", "ViewsRecent", "ViewsLifeTime", "LastModifiedTime"],
        trimDuplicates: false,
        enableStemming: false,
        refiners: [],
        refinementFilters: [],
      });

      return outcome.rows.map((row) => ({
        path: row.Path ?? "",
        viewsRecent: Number(row.ViewsRecent ?? 0),
        viewsLifetime: Number(row.ViewsLifeTime ?? 0),
        lastModified: row.LastModifiedTime ?? "",
      }));
    },
  };
}

function readDates(row: ItemRow, columns: string[]): Record<string, string> {
  const dates: Record<string, string> = {};

  columns.forEach((column) => {
    const value = row[column];
    if (typeof value === "string" && value.length > 0) dates[column] = value;
  });

  return dates;
}
