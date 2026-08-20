import { ItemIndexCheck, ListIndexCoverage, SiteIndexSettings } from "../../api/Indexing.types";
export interface IndexingAuditConfig {
    includeHidden: boolean;
    checkCoverage: boolean;
    checkItems: boolean;
    itemsPerList: number;
    readManagedProperties: boolean;
    maxLists: number;
    coverageWarningPercent: number;
}
export interface IndexingAuditData {
    sites: SiteIndexSettings[];
    lists: ListIndexCoverage[];
    items: ItemIndexCheck[];
    managedProperties: string[];
    scannedSites: string[];
}
export interface IndexingTotals {
    lists: number;
    crawlable: number;
    excluded: number;
    uniquePermissions: number;
    expectedItems: number;
    indexedItems: number;
    coveragePercent: number;
    listsBelowTarget: number;
    emptyIndex: number;
    itemsChecked: number;
    itemsMissing: number;
    itemsStale: number;
    managedProperties: number;
    sitesExcluded: number;
}
export interface IndexingAuditView {
    totals: IndexingTotals;
    coverageByList: {
        label: string;
        value: number;
    }[];
    indexedByList: {
        label: string;
        value: number;
    }[];
    crawlSplit: {
        label: string;
        value: number;
    }[];
    itemSplit: {
        label: string;
        value: number;
    }[];
    problems: ListIndexCoverage[];
}
//# sourceMappingURL=IndexingAudit.types.d.ts.map