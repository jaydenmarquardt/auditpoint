export interface RichColumn {
    internalName: string;
    title: string;
    typeName: string;
}
export interface ContentRecord {
    siteUrl: string;
    source: "page" | "item";
    listTitle: string;
    itemId: number;
    column: string;
    title: string;
    url: string;
    modified: string;
    contentType: string;
    html: string;
}
//# sourceMappingURL=Content.types.d.ts.map