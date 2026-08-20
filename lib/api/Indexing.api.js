import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { Search } from "./Search.api";
import { absoluteFromServerRelative } from "../utils/Url.util";
const STALE_TOLERANCE_MS = 5 * 60 * 1000;
export function Indexing(webUrl) {
    return {
        site() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const web = (yield throttled(() => getSp(webUrl).web.select("Url", "Title", "NoCrawl", "SearchScope")(), {
                    label: "Indexing.site",
                    priority: true,
                }));
                return {
                    url: web.Url,
                    title: web.Title,
                    noCrawl: Boolean(web.NoCrawl),
                    searchScope: Number((_a = web.SearchScope) !== null && _a !== void 0 ? _a : 0),
                };
            });
        },
        /** One search call per list gives the indexed item count for that path. */
        indexedCount(list) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const path = absoluteUrl(list.serverRelativeUrl, (_a = list.siteUrl) !== null && _a !== void 0 ? _a : webUrl);
                const outcome = yield Search(webUrl).run({
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
            });
        },
        sampleItems(list, count) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.select("Title", "FileRef", "Modified")
                    .orderBy("Modified", false)
                    .top(count)(), { label: "Indexing.sampleItems" }));
                return rows.map((row) => {
                    var _a, _b, _c, _d;
                    return ({
                        title: row.Title || ((_a = row.FileRef) === null || _a === void 0 ? void 0 : _a.split("/").pop()) || "",
                        url: absoluteUrl((_b = row.FileRef) !== null && _b !== void 0 ? _b : "", (_c = list.siteUrl) !== null && _c !== void 0 ? _c : webUrl),
                        modified: (_d = row.Modified) !== null && _d !== void 0 ? _d : "",
                    });
                });
            });
        },
        checkItem(list, item) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const check = yield Search(webUrl).isIndexed(item.url);
                const indexedModified = (_a = check.row) === null || _a === void 0 ? void 0 : _a.LastModifiedTime;
                return {
                    siteUrl: (_c = (_b = list.siteUrl) !== null && _b !== void 0 ? _b : webUrl) !== null && _c !== void 0 ? _c : "",
                    listTitle: list.title,
                    title: item.title,
                    url: item.url,
                    itemModified: item.modified,
                    indexed: check.indexed,
                    indexedModified,
                    stale: isStale(item.modified, indexedModified),
                };
            });
        },
        managedProperties() {
            return Search(webUrl).managedProperties();
        },
    };
}
function isStale(itemModified, indexedModified) {
    if (!itemModified || !indexedModified)
        return false;
    return new Date(itemModified).getTime() - new Date(indexedModified).getTime() > STALE_TOLERANCE_MS;
}
function absoluteUrl(serverRelativeUrl, siteUrl) {
    if (!serverRelativeUrl)
        return "";
    if (/^https?:\/\//i.test(serverRelativeUrl))
        return serverRelativeUrl;
    return absoluteFromServerRelative(serverRelativeUrl, siteUrl !== null && siteUrl !== void 0 ? siteUrl : window.location.href);
}
//# sourceMappingURL=Indexing.api.js.map