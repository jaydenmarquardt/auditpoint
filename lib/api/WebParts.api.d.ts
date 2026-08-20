import { CanvasPage, PageWebParts } from "./WebParts.types";
export declare function PageCanvas(webUrl?: string): {
    getPages(top: number): Promise<CanvasPage[]>;
    parse(page: CanvasPage, siteUrl: string, includeTitleArea: boolean): PageWebParts;
};
//# sourceMappingURL=WebParts.api.d.ts.map