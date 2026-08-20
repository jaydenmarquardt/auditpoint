export declare function serverRelative(absoluteOrRelative: string, webUrl: string): string;
export declare function joinPath(...segments: string[]): string;
/** The route lives in the query string so a module can be linked to directly. */
export declare function readRoute(fallback: string): string;
export declare function writeRoute(route: string): void;
/** Server-relative paths are origin-relative, so only the origin has to be prefixed. */
export declare function absoluteFromServerRelative(serverRelativeUrl: string, webAbsoluteUrl: string): string;
/** SharePoint switches a page into edit mode via the Mode query string. */
export declare function editModeUrl(): string;
//# sourceMappingURL=Url.util.d.ts.map