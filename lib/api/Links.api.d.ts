import { LinkContext, LinkCheck, LinkPlacement } from "./Links.types";
export declare function LinkScanner(webUrl?: string): {
    fromHtml(html: string, context: LinkContext): LinkPlacement[];
    fromUrl(url: string, text: string, context: LinkContext, newTab?: boolean): LinkPlacement;
    fromProperties(properties: Record<string, unknown>, context: LinkContext): LinkPlacement[];
};
export declare function LinkChecker(): {
    check(url: string): Promise<LinkCheck>;
};
export declare function placement(url: string, text: string, context: LinkContext, origin: string, newTab?: boolean): LinkPlacement;
export declare function originOf(webUrl?: string): string;
//# sourceMappingURL=Links.api.d.ts.map