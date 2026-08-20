import { IndexingAuditContent } from "./IndexingAudit.content";
export function coveragePercent(list) {
    if (list.indexedCount === undefined)
        return undefined;
    if (list.itemCount === 0)
        return list.indexedCount === 0 ? 100 : 100;
    return Math.min(100, Math.round((list.indexedCount / list.itemCount) * 100));
}
export function buildView(data, config) {
    var _a, _b, _c, _d;
    const lists = (_a = data === null || data === void 0 ? void 0 : data.lists) !== null && _a !== void 0 ? _a : [];
    const items = (_b = data === null || data === void 0 ? void 0 : data.items) !== null && _b !== void 0 ? _b : [];
    const crawlable = lists.filter((list) => !list.noCrawl);
    const measured = crawlable.filter((list) => list.indexedCount !== undefined);
    const expectedItems = measured.reduce((sum, list) => sum + list.itemCount, 0);
    const indexedItems = measured.reduce((sum, list) => { var _a; return sum + ((_a = list.indexedCount) !== null && _a !== void 0 ? _a : 0); }, 0);
    const below = measured.filter((list) => {
        const percent = coveragePercent(list);
        return percent !== undefined && list.itemCount > 0 && percent < config.coverageWarningPercent;
    });
    const totals = {
        lists: lists.length,
        crawlable: crawlable.length,
        excluded: lists.length - crawlable.length,
        uniquePermissions: lists.filter((list) => list.hasUniquePermissions).length,
        expectedItems,
        indexedItems,
        coveragePercent: expectedItems === 0 ? 0 : Math.min(100, Math.round((indexedItems / expectedItems) * 100)),
        listsBelowTarget: below.length,
        emptyIndex: measured.filter((list) => { var _a; return list.itemCount > 0 && ((_a = list.indexedCount) !== null && _a !== void 0 ? _a : 0) === 0; }).length,
        itemsChecked: items.length,
        itemsMissing: items.filter((item) => !item.indexed).length,
        itemsStale: items.filter((item) => item.indexed && item.stale).length,
        managedProperties: ((_c = data === null || data === void 0 ? void 0 : data.managedProperties) !== null && _c !== void 0 ? _c : []).length,
        sitesExcluded: ((_d = data === null || data === void 0 ? void 0 : data.sites) !== null && _d !== void 0 ? _d : []).filter((site) => site.noCrawl).length,
    };
    return {
        totals,
        coverageByList: [...measured]
            .filter((list) => list.itemCount > 0)
            .sort((a, b) => { var _a, _b; return ((_a = coveragePercent(a)) !== null && _a !== void 0 ? _a : 0) - ((_b = coveragePercent(b)) !== null && _b !== void 0 ? _b : 0); })
            .slice(0, 12)
            .map((list) => { var _a; return ({ label: list.title, value: (_a = coveragePercent(list)) !== null && _a !== void 0 ? _a : 0 }); }),
        indexedByList: [...measured]
            .sort((a, b) => { var _a, _b; return ((_a = b.indexedCount) !== null && _a !== void 0 ? _a : 0) - ((_b = a.indexedCount) !== null && _b !== void 0 ? _b : 0); })
            .slice(0, 12)
            .map((list) => { var _a; return ({ label: list.title, value: (_a = list.indexedCount) !== null && _a !== void 0 ? _a : 0 }); }),
        crawlSplit: [
            { label: IndexingAuditContent.crawl.on, value: totals.crawlable },
            { label: IndexingAuditContent.crawl.off, value: totals.excluded },
        ],
        itemSplit: [
            {
                label: IndexingAuditContent.state.indexed,
                value: totals.itemsChecked - totals.itemsMissing - totals.itemsStale,
            },
            { label: IndexingAuditContent.state.missing, value: totals.itemsMissing },
            { label: IndexingAuditContent.state.stale, value: totals.itemsStale },
        ],
        problems: [...below, ...lists.filter((list) => list.noCrawl && list.itemCount > 0)].slice(0, 200),
    };
}
//# sourceMappingURL=IndexingAudit.logic.js.map