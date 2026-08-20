import { coveragePercent } from "./IndexingAudit.logic";
import { downloadCsv } from "../../utils/Export.util";
export function listRow(list) {
    var _a, _b, _c;
    return {
        site: list.siteUrl,
        list: list.title,
        url: list.url,
        template: list.templateName,
        hidden: list.hidden,
        excludedFromSearch: list.noCrawl,
        uniquePermissions: list.hasUniquePermissions,
        items: list.itemCount,
        indexed: (_a = list.indexedCount) !== null && _a !== void 0 ? _a : "",
        coveragePercent: (_b = coveragePercent(list)) !== null && _b !== void 0 ? _b : "",
        lastItemModified: list.lastItemModified,
        error: (_c = list.error) !== null && _c !== void 0 ? _c : "",
    };
}
export function itemRow(item) {
    var _a;
    return {
        site: item.siteUrl,
        list: item.listTitle,
        title: item.title,
        url: item.url,
        indexed: item.indexed,
        stale: item.stale,
        itemModified: item.itemModified,
        indexedModified: (_a = item.indexedModified) !== null && _a !== void 0 ? _a : "",
    };
}
export function exportIndexingAudit(data) {
    var _a;
    downloadCsv("indexing-audit", ((_a = data === null || data === void 0 ? void 0 : data.lists) !== null && _a !== void 0 ? _a : []).map(listRow));
}
export function exportIndexChecks(data) {
    var _a;
    downloadCsv("indexing-item-checks", ((_a = data === null || data === void 0 ? void 0 : data.items) !== null && _a !== void 0 ? _a : []).map(itemRow));
}
//# sourceMappingURL=IndexingAudit.csv.js.map