import { CanvasPage, CatalogueEntry, WebPartInstance } from "../../api/WebParts.types";
export interface WebPartAuditConfig {
    maxPages: number;
    includeTitleArea: boolean;
    keepProperties: boolean;
    readCatalogue: boolean;
}
export interface WebPartPageSummary {
    siteUrl: string;
    pageId: number;
    title: string;
    url: string;
    modified: string;
    pageLayout: string;
    webPartCount: number;
    sections: number;
    distinctTypes: number;
    parseError?: string;
}
export interface WebPartAuditData {
    instances: WebPartInstance[];
    pages: WebPartPageSummary[];
    scannedSites: string[];
    catalogue: CatalogueEntry[];
    /** Cleared once the canvas is parsed; only used to resume mid-run. */
    rawPages: (CanvasPage & {
        siteUrl: string;
    })[];
}
export interface WebPartTypeSummary {
    key: string;
    name: string;
    webPartId: string;
    instances: number;
    pages: number;
    isOutOfBox: boolean;
    isThirdParty: boolean;
    propertyKeys: string[];
    /** Keys present on every instance of this web part. */
    commonPropertyKeys: string[];
    /** Keys whose value is identical on every instance. */
    sharedValues: {
        key: string;
        value: string;
    }[];
    iconName: string;
    iconUrl: string;
    description: string;
    group: string;
    inCatalogue: boolean;
}
export interface WebPartAuditView {
    totals: {
        pages: number;
        pagesWithContent: number;
        emptyPages: number;
        instances: number;
        types: number;
        outOfBox: number;
        thirdParty: number;
        textBlocks: number;
        averagePerPage: number;
        instancesOutOfBox: number;
        instancesThirdParty: number;
        instancesStock: number;
    };
    types: WebPartTypeSummary[];
    catalogueOnly: {
        id: string;
        title: string;
        group: string;
        iconName: string;
    }[];
    topTypes: {
        label: string;
        value: number;
    }[];
    busiestPages: WebPartPageSummary[];
    layoutSplit: {
        key: string;
        label: string;
        value: number;
    }[];
}
//# sourceMappingURL=WebPartAudit.types.d.ts.map