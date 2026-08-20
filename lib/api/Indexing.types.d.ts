export interface SiteIndexSettings {
    url: string;
    title: string;
    /** True when the whole web is excluded from search. */
    noCrawl: boolean;
    searchScope: number;
}
export interface ListIndexCoverage {
    siteUrl: string;
    listId: string;
    title: string;
    url: string;
    templateName: string;
    hidden: boolean;
    noCrawl: boolean;
    hasUniquePermissions: boolean;
    itemCount: number;
    lastItemModified: string;
    indexedCount?: number;
    error?: string;
}
export interface ItemIndexCheck {
    siteUrl: string;
    listTitle: string;
    title: string;
    url: string;
    itemModified: string;
    indexed: boolean;
    indexedModified?: string;
    /** Indexed copy is older than the item, so the crawl has not caught up. */
    stale: boolean;
}
export interface SampleItem {
    title: string;
    url: string;
    modified: string;
}
//# sourceMappingURL=Indexing.types.d.ts.map