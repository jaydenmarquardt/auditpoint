export interface PublishingItem {
    siteUrl: string;
    listTitle: string;
    listId: string;
    itemId: number;
    title: string;
    url: string;
    created: string;
    modified: string;
    authorTitle: string;
    editorTitle: string;
    moderationStatus?: number;
    versionLabel: string;
    versionCount?: number;
    versionEditors?: string[];
    dates: Record<string, string>;
    viewsRecent?: number;
    viewsLifetime?: number;
    lastViewed?: string;
}
export interface PopularityRow {
    path: string;
    viewsRecent: number;
    viewsLifetime: number;
    lastModified: string;
}
//# sourceMappingURL=Publishing.types.d.ts.map