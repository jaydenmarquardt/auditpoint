import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
const RICH_TYPES = ["Note", "HTML", "MultiLine"];
/**
 * Underscore prefixed columns such as _ModerationComments are typed as rich text but
 * cannot be selected over REST: asking for one fails the whole request with
 * "The field or property does not exist".
 */
function isSelectable(internalName) {
    return !internalName.startsWith("_");
}
export function ContentSource(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        richTextColumns(list) {
            return __awaiter(this, void 0, void 0, function* () {
                const fields = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .fields.select("InternalName", "Title", "TypeAsString", "Hidden", "RichText")(), { label: "Content.fields" }));
                return fields
                    .filter((field) => !field.Hidden && RICH_TYPES.indexOf(field.TypeAsString) !== -1 && isSelectable(field.InternalName))
                    .map((field) => ({
                    internalName: field.InternalName,
                    title: field.Title,
                    typeName: field.TypeAsString,
                }));
            });
        },
        fieldNames(list) {
            return __awaiter(this, void 0, void 0, function* () {
                const fields = (yield throttled(() => getSp(webUrl).web.lists.getById(list.id).fields.select("InternalName")(), { label: "Content.fieldNames" }));
                return fields.map((field) => field.InternalName).filter(isSelectable);
            });
        },
        /** Selecting a column the list does not have fails the whole request. */
        items(list, columns, top) {
            return __awaiter(this, void 0, void 0, function* () {
                if (columns.length === 0)
                    return [];
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.select("Id", "Title", "FileRef", "Modified", "ContentType/Name", ...columns)
                    .expand("ContentType")
                    .top(top)(), { label: "Content.items" }));
                return rows.flatMap((row) => columns
                    .map((column) => { var _a; return String((_a = row[column]) !== null && _a !== void 0 ? _a : ""); })
                    .map((html, index) => ({ html, column: columns[index] }))
                    .filter((entry) => entry.html.trim().length > 0)
                    .map((entry) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        siteUrl: site,
                        source: "item",
                        listTitle: list.title,
                        itemId: Number(row.Id),
                        column: entry.column,
                        title: String((_b = (_a = row.Title) !== null && _a !== void 0 ? _a : row.FileRef) !== null && _b !== void 0 ? _b : row.Id),
                        url: String((_c = row.FileRef) !== null && _c !== void 0 ? _c : ""),
                        modified: String((_d = row.Modified) !== null && _d !== void 0 ? _d : ""),
                        contentType: String((_f = (_e = row.ContentType) === null || _e === void 0 ? void 0 : _e.Name) !== null && _f !== void 0 ? _f : ""),
                        html: entry.html,
                    });
                }));
            });
        },
        /** Page text lives in rich text canvas controls rather than a single column. */
        pageHtml(page) {
            var _a, _b;
            const canvas = `${(_a = page.canvasContent) !== null && _a !== void 0 ? _a : ""}${(_b = page.titleAreaContent) !== null && _b !== void 0 ? _b : ""}`;
            if (!canvas.trim())
                return "";
            const document = new DOMParser().parseFromString(canvas, "text/html");
            const blocks = Array.from(document.querySelectorAll("[data-sp-rte]"));
            if (blocks.length > 0)
                return blocks.map((block) => block.innerHTML).join("\n");
            return document.body.innerHTML;
        },
    };
}
//# sourceMappingURL=Content.api.js.map