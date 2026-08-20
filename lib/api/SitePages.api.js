import { createListApi } from "./List.api";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
const sitePagesList = createListApi({
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
    map: (row) => {
        var _a, _b, _c;
        return ({
            id: row.Id,
            title: row.Title || row.FileLeafRef,
            fileName: row.FileLeafRef,
            serverRelativeUrl: row.FileRef,
            modified: row.Modified,
            created: row.Created,
            modifiedBy: (_b = (_a = row.Editor) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : "",
            pageLayout: row.PageLayoutType,
            promotedState: (_c = row.PromotedState) !== null && _c !== void 0 ? _c : 0,
        });
    },
});
export function SitePages(webUrl) {
    return Object.assign(Object.assign({}, sitePagesList(webUrl)), { getHtml(serverRelativeUrl) {
            return throttled(() => getSp(webUrl).web.getFileByServerRelativePath(serverRelativeUrl).getText(), {
                label: "SitePages.getHtml",
            });
        } });
}
//# sourceMappingURL=SitePages.api.js.map