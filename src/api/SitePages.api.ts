import { createListApi } from "@/api/List.api";
import { ListApi } from "@/api/List.types";
import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SitePage, SitePageRow } from "@/api/SitePages.types";

const sitePagesList = createListApi<SitePageRow, SitePage>({
  title: "Site Pages",
  select: [
    "Id",
    "Title",
    "FileLeafRef",
    "FileRef",
    "Modified",
    "Created",
    "PageLayoutType",
    "PromotedState",
    "Editor/Title",
  ],
  expand: ["Editor"],
  map: (row) => ({
    id: row.Id,
    title: row.Title || row.FileLeafRef,
    fileName: row.FileLeafRef,
    serverRelativeUrl: row.FileRef,
    modified: row.Modified,
    created: row.Created,
    modifiedBy: row.Editor?.Title ?? "",
    pageLayout: row.PageLayoutType,
    promotedState: row.PromotedState ?? 0,
  }),
});

export function SitePages(webUrl?: string): ListApi<SitePage> & {
  getHtml(serverRelativeUrl: string): Promise<string>;
} {
  return {
    ...sitePagesList(webUrl),
    getHtml(serverRelativeUrl: string): Promise<string> {
      return throttled(() => getSp(webUrl).web.getFileByServerRelativePath(serverRelativeUrl).getText(), {
        label: "SitePages.getHtml",
      });
    },
  };
}
