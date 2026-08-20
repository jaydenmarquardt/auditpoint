/** Where in a thing the link was written. */
export type LinkSource = "content" | "webpart" | "navigation" | "document";
/** What the link points at. Drives the type column and whether it is worth testing. */
export type LinkType = "intranet" | "legacy" | "document" | "external" | "anchor" | "contact" | "script" | "unknown";
/**
 * Cross origin responses cannot be read back, so anything off this tenancy stays
 * unsure however many times it is checked.
 */
export type BrokenState = "yes" | "no" | "unsure";
/** One link exactly as it was written, before anything has been resolved. */
export interface LinkPlacement {
    url: string;
    text: string;
    source: LinkSource;
    /** Web part name, navigation trail or file name, depending on the source. */
    sourceLabel: string;
    isInternal: boolean;
    isExternal: boolean;
    isInsecure: boolean;
    isAnchor: boolean;
    isContact: boolean;
    isJS: boolean;
}
export interface LinkContext {
    source: LinkSource;
    sourceLabel: string;
}
export interface LinkCheck {
    url: string;
    /** 0 when the request failed at the network level, which proves nothing. */
    status: number;
}
/** One navigation node flattened out of a nav tree. */
export interface NavigationLink {
    url: string;
    text: string;
    /** Breadcrumb trail through the menu, so an editor can find the node again. */
    path: string;
    menu: string;
}
//# sourceMappingURL=Links.types.d.ts.map