import { SiteList } from "./Lists.types";
import { ImageFile, ImageUsage } from "./Images.types";
export declare const IMAGE_EXTENSIONS: string[];
export declare function ImageFiles(webUrl?: string): {
    inLibrary(list: SiteList, max: number): Promise<ImageFile[]>;
    fromHtml(html: string, context: Omit<ImageUsage, "src" | "path" | "alt" | "hasAlt" | "width" | "height" | "isExternal">): ImageUsage[];
};
export declare function normalisePath(src: string): string;
//# sourceMappingURL=Images.api.d.ts.map