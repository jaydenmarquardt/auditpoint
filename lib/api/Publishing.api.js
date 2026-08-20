import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { Search } from "./Search.api";
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
export function Publishing(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        fieldNames(list) {
            return __awaiter(this, void 0, void 0, function* () {
                const fields = (yield throttled(() => getSp(webUrl).web.lists.getById(list.id).fields.select("InternalName")(), { label: "Publishing.fields" }));
                return fields.map((field) => field.InternalName);
            });
        },
        /** Only columns the list actually has are selected, since one bad name fails the request. */
        items(list, dateColumns, top) {
            return __awaiter(this, void 0, void 0, function* () {
                const read = (columns) => __awaiter(this, void 0, void 0, function* () {
                    return (yield throttled(() => getSp(webUrl)
                        .web.lists.getById(list.id)
                        .items.select(...BASE_SELECT, ...columns)
                        .expand("Author", "Editor")
                        .orderBy("Modified", false)
                        .top(top)(), { label: "Publishing.items" }));
                });
                let rows;
                try {
                    rows = yield read(dateColumns);
                }
                catch (_a) {
                    rows = yield read([]);
                }
                return rows.map((row) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    return ({
                        siteUrl: site,
                        listTitle: list.title,
                        listId: list.id,
                        itemId: row.Id,
                        title: String((_c = (_a = row.Title) !== null && _a !== void 0 ? _a : (_b = row.FileRef) === null || _b === void 0 ? void 0 : _b.split("/").pop()) !== null && _c !== void 0 ? _c : row.Id),
                        url: String((_d = row.FileRef) !== null && _d !== void 0 ? _d : ""),
                        created: String((_e = row.Created) !== null && _e !== void 0 ? _e : ""),
                        modified: String((_f = row.Modified) !== null && _f !== void 0 ? _f : ""),
                        authorTitle: (_h = (_g = row.Author) === null || _g === void 0 ? void 0 : _g.Title) !== null && _h !== void 0 ? _h : "",
                        editorTitle: (_k = (_j = row.Editor) === null || _j === void 0 ? void 0 : _j.Title) !== null && _k !== void 0 ? _k : "",
                        moderationStatus: row.OData__ModerationStatus,
                        versionLabel: String((_l = row.OData__UIVersionString) !== null && _l !== void 0 ? _l : ""),
                        dates: readDates(row, dateColumns),
                    });
                });
            });
        },
        versions(list, itemId, depth) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.getById(itemId)
                    .versions.select("VersionLabel", "Created", "Editor/Title")
                    .expand("Editor")
                    .top(depth)(), { label: "Publishing.versions" }));
                return {
                    count: rows.length,
                    editors: [...new Set(rows.map((row) => { var _a, _b; return (_b = (_a = row.Editor) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : ""; }).filter(Boolean))],
                };
            });
        },
        /** Search carries the view counts that the REST item APIs do not expose. */
        popularity(rowLimit) {
            return __awaiter(this, void 0, void 0, function* () {
                const outcome = yield Search(webUrl).run({
                    queryText: `Path:"${site}"`,
                    rowLimit,
                    startRow: 0,
                    selectProperties: ["Path", "ViewsRecent", "ViewsLifeTime", "LastModifiedTime"],
                    trimDuplicates: false,
                    enableStemming: false,
                    refiners: [],
                    refinementFilters: [],
                });
                return outcome.rows.map((row) => {
                    var _a, _b, _c, _d;
                    return ({
                        path: (_a = row.Path) !== null && _a !== void 0 ? _a : "",
                        viewsRecent: Number((_b = row.ViewsRecent) !== null && _b !== void 0 ? _b : 0),
                        viewsLifetime: Number((_c = row.ViewsLifeTime) !== null && _c !== void 0 ? _c : 0),
                        lastModified: (_d = row.LastModifiedTime) !== null && _d !== void 0 ? _d : "",
                    });
                });
            });
        },
    };
}
function readDates(row, columns) {
    const dates = {};
    columns.forEach((column) => {
        const value = row[column];
        if (typeof value === "string" && value.length > 0)
            dates[column] = value;
    });
    return dates;
}
//# sourceMappingURL=Publishing.api.js.map