import { LinkPlacement } from "./Links.types";
export declare function ConfigFiles(webUrl?: string): {
    read(serverRelativeUrl: string): Promise<unknown>;
    links(json: unknown, fileName: string): LinkPlacement[];
    megaMenuLinks(json: unknown, fileName: string): LinkPlacement[];
};
export declare function splitPaths(raw: string): string[];
//# sourceMappingURL=ConfigFiles.api.d.ts.map