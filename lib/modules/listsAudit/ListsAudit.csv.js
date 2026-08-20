import { downloadCsv } from "../../utils/Export.util";
export function listRow(list) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        site: (_a = list.siteUrl) !== null && _a !== void 0 ? _a : "",
        title: list.title,
        template: list.templateName,
        hidden: list.hidden,
        items: list.itemCount,
        scannedItems: (_b = list.scannedItems) !== null && _b !== void 0 ? _b : "",
        folders: (_c = list.folderCount) !== null && _c !== void 0 ? _c : "",
        files: (_d = list.fileCount) !== null && _d !== void 0 ? _d : "",
        storageBytes: (_e = list.storageBytes) !== null && _e !== void 0 ? _e : "",
        contentTypes: ((_f = list.contentTypes) !== null && _f !== void 0 ? _f : []).join("|"),
        fileTypes: Object.entries((_g = list.extensions) !== null && _g !== void 0 ? _g : {})
            .map(([extension, stat]) => `${extension}:${stat.count}`)
            .join("|"),
        lastItemModified: list.lastItemModified,
        versioning: list.versioningEnabled,
        uniquePermissions: list.hasUniquePermissions,
        url: list.serverRelativeUrl,
    };
}
export function exportListsAudit(data) {
    var _a;
    downloadCsv("lists-audit", ((_a = data === null || data === void 0 ? void 0 : data.lists) !== null && _a !== void 0 ? _a : []).map(listRow));
}
//# sourceMappingURL=ListsAudit.csv.js.map