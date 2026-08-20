export function buildView(data) {
    var _a, _b;
    const lists = (_a = data === null || data === void 0 ? void 0 : data.lists) !== null && _a !== void 0 ? _a : [];
    const visible = lists.filter((list) => !list.hidden);
    return {
        totals: totalsOf(lists),
        byTemplate: countBy(visible.map((list) => list.templateName)),
        byContentType: countBy(visible.flatMap((list) => { var _a; return (_a = list.contentTypes) !== null && _a !== void 0 ? _a : []; })).slice(0, 12),
        byExtension: extensionCounts(visible, "count").slice(0, 12),
        byExtensionSize: extensionCounts(visible, "bytes").slice(0, 12),
        largestByItems: [...visible].sort((a, b) => b.itemCount - a.itemCount).slice(0, 10),
        largest: [...visible]
            .filter((list) => { var _a; return ((_a = list.storageBytes) !== null && _a !== void 0 ? _a : 0) > 0; })
            .sort((a, b) => { var _a, _b; return ((_a = b.storageBytes) !== null && _a !== void 0 ? _a : 0) - ((_b = a.storageBytes) !== null && _b !== void 0 ? _b : 0); })
            .slice(0, 10),
        empty: visible.filter((list) => list.itemCount === 0),
        risky: visible.filter((list) => !list.versioningEnabled || list.hasUniquePermissions),
        storageAvailable: (_b = data === null || data === void 0 ? void 0 : data.storageAvailable) !== null && _b !== void 0 ? _b : visible.some((list) => { var _a; return ((_a = list.storageBytes) !== null && _a !== void 0 ? _a : 0) > 0; }),
        truncated: lists.filter((list) => list.scanTruncated).length,
    };
}
export function totalsOf(lists) {
    const visible = lists.filter((list) => !list.hidden);
    const contentTypes = new Set(visible.flatMap((list) => { var _a; return (_a = list.contentTypes) !== null && _a !== void 0 ? _a : []; }));
    return {
        lists: visible.filter((list) => list.kind === "list").length,
        libraries: visible.filter((list) => list.kind === "library").length,
        hidden: lists.length - visible.length,
        items: visible.reduce((sum, list) => sum + list.itemCount, 0),
        files: visible.reduce((sum, list) => { var _a; return sum + ((_a = list.fileCount) !== null && _a !== void 0 ? _a : 0); }, 0),
        folders: visible.reduce((sum, list) => { var _a; return sum + ((_a = list.folderCount) !== null && _a !== void 0 ? _a : 0); }, 0),
        storageBytes: visible.reduce((sum, list) => { var _a; return sum + ((_a = list.storageBytes) !== null && _a !== void 0 ? _a : 0); }, 0),
        contentTypes: contentTypes.size,
        noVersioning: visible.filter((list) => !list.versioningEnabled).length,
        uniquePermissions: visible.filter((list) => list.hasUniquePermissions).length,
        empty: visible.filter((list) => list.itemCount === 0).length,
    };
}
export function isStale(list, staleDays) {
    if (!list.lastItemModified)
        return false;
    return Date.now() - new Date(list.lastItemModified).getTime() > staleDays * 24 * 60 * 60 * 1000;
}
export function daysSince(iso) {
    if (!iso)
        return 0;
    return Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}
const EXTENSION_LABELS = {
    "000": "List item",
    aspx: "Page",
};
export function extensionLabel(extension) {
    var _a;
    return (_a = EXTENSION_LABELS[extension]) !== null && _a !== void 0 ? _a : `.${extension}`;
}
function extensionCounts(lists, measure) {
    const counts = new Map();
    lists.forEach((list) => {
        var _a;
        return Object.entries((_a = list.extensions) !== null && _a !== void 0 ? _a : {}).forEach(([extension, stat]) => { var _a; return counts.set(extension, ((_a = counts.get(extension)) !== null && _a !== void 0 ? _a : 0) + stat[measure]); });
    });
    return [...counts.entries()]
        .map(([label, value]) => ({ key: label, label: extensionLabel(label), value }))
        .filter((entry) => entry.value > 0)
        .sort((a, b) => b.value - a.value);
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ key: label, label, value }))
        .sort((a, b) => b.value - a.value);
}
//# sourceMappingURL=ListsAudit.logic.js.map