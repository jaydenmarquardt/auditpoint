export interface CanvasPage {
    id: number;
    title: string;
    fileName: string;
    serverRelativeUrl: string;
    modified: string;
    pageLayout: string;
    canvasContent: string;
    titleAreaContent: string;
}
export type ControlKind = "webPart" | "text" | "image" | "spacer" | "unknown";
export interface WebPartInstance {
    siteUrl: string;
    pageId: number;
    pageTitle: string;
    pageUrl: string;
    instanceId: string;
    webPartId: string;
    name: string;
    kind: ControlKind;
    title: string;
    section: number;
    column: number;
    /** Zero for the page body, one for the title area. */
    layer: number;
    propertyKeys: string[];
    properties: Record<string, unknown>;
    isOutOfBox: boolean;
    isThirdParty: boolean;
}
export interface CatalogueEntry {
    id: string;
    name: string;
    title: string;
    description: string;
    iconName: string;
    iconUrl: string;
    group: string;
    alias: string;
    version: string;
    componentType: number;
    status: number;
    isInternal: boolean;
}
export interface PageWebParts {
    page: CanvasPage;
    instances: WebPartInstance[];
    sections: number;
    parseError?: string;
}
//# sourceMappingURL=WebParts.types.d.ts.map