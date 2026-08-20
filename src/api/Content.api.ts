import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SiteList } from "@/api/Lists.types";
import { CanvasPage } from "@/api/WebParts.types";
import { ContentRecord, RichColumn } from "@/api/Content.types";

const RICH_TYPES = ["Note", "HTML", "MultiLine"];

/**
 * Underscore prefixed columns such as _ModerationComments are typed as rich text but
 * cannot be selected over REST: asking for one fails the whole request with
 * "The field or property does not exist".
 */
function isSelectable(internalName: string): boolean {
  return !internalName.startsWith("_");
}

interface FieldRow {
  InternalName: string;
  Title: string;
  TypeAsString: string;
  Hidden?: boolean;
  RichText?: boolean;
}

export function ContentSource(webUrl?: string): {
  richTextColumns(list: SiteList): Promise<RichColumn[]>;
  fieldNames(list: SiteList): Promise<string[]>;
  items(list: SiteList, columns: string[], top: number): Promise<ContentRecord[]>;
  pageHtml(page: CanvasPage): string;
} {
  const site = webUrl ?? "";

  return {
    async richTextColumns(list: SiteList): Promise<RichColumn[]> {
      const fields = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .fields.select("InternalName", "Title", "TypeAsString", "Hidden", "RichText")(),
        { label: "Content.fields" }
      )) as FieldRow[];

      return fields
        .filter(
          (field) =>
            !field.Hidden && RICH_TYPES.indexOf(field.TypeAsString) !== -1 && isSelectable(field.InternalName)
        )
        .map((field) => ({
          internalName: field.InternalName,
          title: field.Title,
          typeName: field.TypeAsString,
        }));
    },

    async fieldNames(list: SiteList): Promise<string[]> {
      const fields = (await throttled(
        () => getSp(webUrl).web.lists.getById(list.id).fields.select("InternalName")(),
        { label: "Content.fieldNames" }
      )) as { InternalName: string }[];

      return fields.map((field) => field.InternalName).filter(isSelectable);
    },

    /** Selecting a column the list does not have fails the whole request. */
    async items(list: SiteList, columns: string[], top: number): Promise<ContentRecord[]> {
      if (columns.length === 0) return [];

      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .items.select("Id", "Title", "FileRef", "Modified", "ContentType/Name", ...columns)
            .expand("ContentType")
            .top(top)(),
        { label: "Content.items" }
      )) as Record<string, string | number | { Name?: string }>[];

      return rows.flatMap((row) =>
        columns
          .map((column) => String(row[column] ?? ""))
          .map((html, index) => ({ html, column: columns[index] }))
          .filter((entry) => entry.html.trim().length > 0)
          .map((entry) => ({
            siteUrl: site,
            source: "item" as const,
            listTitle: list.title,
            itemId: Number(row.Id),
            column: entry.column,
            title: String(row.Title ?? row.FileRef ?? row.Id),
            url: String(row.FileRef ?? ""),
            modified: String(row.Modified ?? ""),
            contentType: String((row.ContentType as { Name?: string })?.Name ?? ""),
            html: entry.html,
          }))
      );
    },

    /** Page text lives in rich text canvas controls rather than a single column. */
    pageHtml(page: CanvasPage): string {
      const canvas = `${page.canvasContent ?? ""}${page.titleAreaContent ?? ""}`;
      if (!canvas.trim()) return "";

      const document = new DOMParser().parseFromString(canvas, "text/html");
      const blocks = Array.from(document.querySelectorAll("[data-sp-rte]"));

      if (blocks.length > 0) return blocks.map((block) => block.innerHTML).join("\n");
      return document.body.innerHTML;
    },
  };
}
