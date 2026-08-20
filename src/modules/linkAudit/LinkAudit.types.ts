import { BrokenState, LinkPlacement, LinkSource, LinkType } from "@/api/Links.types";

export interface LinkAuditConfig {
  maxPages: number;
  scanWebParts: boolean;
  scanListItems: boolean;
  columnNames: string;
  autoDetectColumns: boolean;
  maxItemsPerList: number;
  maxLists: number;
  scanNavigation: boolean;
  scanAttachments: boolean;
  configPaths: string;
  megaMenuPath: string;
  includeDocuments: boolean;
  maxFilesPerLibrary: number;
  scanDocx: boolean;
  scanPdf: boolean;
  scanHtmlFiles: boolean;
  maxDocumentMb: number;
  checkBrokenLinks: boolean;
  legacyHosts: string;
}

/** What a scanned thing is, which decides how it was read and how it is counted. */
export type ReferenceKind =
  | "page"
  | "item"
  | "document"
  | "navigation"
  | "attachment"
  | "config"
  | "megamenu";

/** One link found inside a reference, with everything the audit later decides about it. */
export interface OutgoingLink extends LinkPlacement {
  linkType: LinkType;
  isIntranet: boolean;
  isLegacy: boolean;
  broken: BrokenState;
  /** Response status from the broken link stage, when one ran. */
  status: number;
  /** Points at a list item's display form, which is a real item behind a form url. */
  isDisplayForm: boolean;
  /** Filled in by the index when the link matched a scanned reference. */
  targetKey: string;
  targetTitle: string;
  targetList: string;
  targetUrl: string;
  targetId: number;
}

/**
 * Flat copy of a reference. Incoming links hold these rather than whole references
 * so the report envelope stays serialisable and free of cycles.
 */
export interface ReferenceSummary {
  key: string;
  siteUrl: string;
  listTitle: string;
  title: string;
  url: string;
  itemId: number;
  /** Carried over from the link that pointed here, so an editor knows where to look. */
  source: LinkSource;
  sourceLabel: string;
}

export interface Reference {
  /** Stable identity across stages and resumes: site, list and item. */
  key: string;
  siteUrl: string;
  kind: ReferenceKind;
  listTitle: string;
  title: string;
  /** Server relative url of the thing itself. */
  url: string;
  itemId: number;
  modified: string;
  /** Set for library items so their file can be read and matched. */
  fileUrl?: string;
  extension?: string;
  sizeBytes?: number;
  scanned: boolean;
  /** Set once the file content itself has been read for links. */
  documentScanned?: boolean;
  skipped?: string;
  outgoing: OutgoingLink[];
  incoming: ReferenceSummary[];
  brokenCount: number;
}

export interface LinkAuditData {
  references: Reference[];
  scannedSites: string[];
  columnsScanned: string[];
  /** Urls actually requested by the broken link stage. */
  checkedUrls: number;
}

export interface LinkUsage {
  reference: ReferenceSummary;
  link: OutgoingLink;
}

/**
 * The same destination written several ways collapses into one of these, so the by
 * link view counts a page once rather than once per spelling.
 */
export interface AggregatedLink {
  key: string;
  url: string;
  text: string;
  linkType: LinkType;
  isIntranet: boolean;
  isLegacy: boolean;
  isExternal: boolean;
  isInsecure: boolean;
  broken: BrokenState;
  status: number;
  targetTitle: string;
  /** Every distinct spelling of this url that was found. */
  variants: string[];
  sourceLists: string[];
  usages: LinkUsage[];
  count: number;
}

export interface LinkTypeTotals {
  thisSite: number;
  otherSite: number;
  share: number;
  legacy: number;
  document: number;
  external: number;
  anchor: number;
  contact: number;
  script: number;
  unknown: number;
  emptyText: number;
  insecure: number;
  matched: number;
  unmapped: number;
  newTab: number;
  internal: number;
  relative: number;
  absolute: number;
  displayForm: number;
  /** Links that should have resolved to a scanned item and did not. */
  mappable: number;
}

export interface ReferenceTotals {
  items: number;
  pages: number;
  listItems: number;
  documents: number;
  pdfs: number;
  docx: number;
  scanned: number;
  documentsRead: number;
  incoming: number;
  outgoing: number;
  webpart: number;
  navigation: number;
  documentLinks: number;
  attachments: number;
  attachmentLinks: number;
  configFiles: number;
  configLinks: number;
  megaMenuLinks: number;
  external: number;
  broken: number;
  untested: number;
  destinations: number;
  orphans: number;
}

export interface LinkAuditView {
  totals: ReferenceTotals;
  /** Mega menu placements, when a menu configuration was scanned. */
  megaMenu: LinkUsage[];
  /** Urls the broken link stage actually requested. */
  checkedUrls: number;
  /** Every link written outside this tenancy, one row per placement. */
  external: LinkUsage[];
  linkTypes: LinkTypeTotals;
  references: Reference[];
  links: AggregatedLink[];
  broken: LinkUsage[];
  byType: { label: string; value: number }[];
  bySource: { label: string; value: number }[];
  byStatus: { label: string; value: number }[];
  brokenByList: { label: string; value: number }[];
  topTargets: { label: string; value: number }[];
}
