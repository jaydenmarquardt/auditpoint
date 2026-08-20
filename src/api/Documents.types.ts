import { LinkPlacement } from "@/api/Links.types";

export type DocumentKind = "docx" | "pdf" | "html" | "unsupported";

export interface DocumentFile {
  siteUrl: string;
  listTitle: string;
  name: string;
  url: string;
  extension: string;
  sizeBytes: number;
  modified: string;
  itemId: number;
}

export interface DocumentScan {
  url: string;
  kind: DocumentKind;
  bytes: number;
  links: LinkPlacement[];
  /** Set when nothing was read, with the reason why. */
  skipped?: string;
  /** Response status of the fetch, so a caller can spot a throttle. */
  status?: number;
}

export interface DocumentScanOptions {
  maxBytes?: number;
  fileName?: string;
}
