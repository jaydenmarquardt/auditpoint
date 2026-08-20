import "@pnp/sp/attachments";
import { SiteList } from "./Lists.types";
import { LinkPlacement } from "./Links.types";
import { DocumentFile, DocumentKind, DocumentScan, DocumentScanOptions } from "./Documents.types";
/** Extensions treated as a document when classifying a link. */
export declare const DOCUMENT_EXTENSIONS: string[];
export declare function DocumentFiles(webUrl?: string): {
    inLibrary(list: SiteList, max: number): Promise<DocumentFile[]>;
};
export declare function ItemAttachments(webUrl?: string): {
    inList(list: SiteList, max: number): Promise<DocumentFile[]>;
};
export declare function extensionOf(name: string): string;
export declare function documentKindFromName(name: string): DocumentKind;
export declare function isScannableDocument(name: string): boolean;
/**
 * Reads every hyperlink out of a document in the browser, with no third party
 * parser. Pass a url to fetch it, or the bytes when they are already to hand.
 */
export declare function scanDocumentForLinks(source: string | ArrayBuffer, options?: DocumentScanOptions): Promise<DocumentScan>;
export declare function extractDocxLinks(buffer: ArrayBuffer, label: string): Promise<LinkPlacement[]>;
export declare function extractPdfLinks(buffer: ArrayBuffer, label: string): Promise<LinkPlacement[]>;
//# sourceMappingURL=Documents.api.d.ts.map