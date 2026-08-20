export type ListKind = "library" | "list" | "system";

export interface SiteList {
  id: string;
  siteUrl?: string;
  title: string;
  description: string;
  kind: ListKind;
  baseTemplate: number;
  templateName: string;
  itemCount: number;
  hidden: boolean;
  created: string;
  lastItemModified: string;
  serverRelativeUrl: string;
  defaultViewUrl: string;
  versioningEnabled: boolean;
  majorVersionLimit: number;
  contentTypesEnabled: boolean;
  hasUniquePermissions: boolean;
  /** True when the list is excluded from the search index. */
  noCrawl: boolean;
  storageBytes?: number;
  fileCount?: number;
  folderCount?: number;
  scannedItems?: number;
  scanTruncated?: boolean;
  extensions?: Record<string, ExtensionStat>;
  contentTypes?: string[];
  /** Set when storage metrics could not be read for this list. */
  metricsError?: string;
}

export interface ExtensionStat {
  count: number;
  bytes: number;
}

export interface ListScan {
  items: number;
  folders: number;
  files: number;
  bytes: number;
  truncated: boolean;
  extensions: Record<string, ExtensionStat>;
}

export interface ListsAuditSummary {
  siteUrl: string;
  siteTitle: string;
  lists: SiteList[];
  totals: {
    lists: number;
    libraries: number;
    hidden: number;
    items: number;
    storageBytes: number;
    files: number;
  };
  staleThresholdDays: number;
  stale: SiteList[];
  empty: SiteList[];
  largest: SiteList[];
  noVersioning: SiteList[];
  uniquePermissions: SiteList[];
}
