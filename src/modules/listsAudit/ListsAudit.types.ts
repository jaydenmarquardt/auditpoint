import { SiteList } from "@/api/Lists.types";

export interface ListsAuditConfig {
  includeHidden: boolean;
  scanItems: boolean;
  readContentTypes: boolean;
  maxItemsPerList: number;
  staleDays: number;
  maxLists: number;
}

export interface ListsAuditData {
  lists: SiteList[];
  scannedSites: string[];
  storageAvailable: boolean;
}

export interface ListsAuditTotals {
  lists: number;
  libraries: number;
  hidden: number;
  items: number;
  files: number;
  folders: number;
  storageBytes: number;
  contentTypes: number;
  noVersioning: number;
  uniquePermissions: number;
  stale: number;
  empty: number;
}

export interface ListsAuditView {
  totals: ListsAuditTotals;
  byTemplate: { key: string; label: string; value: number }[];
  byContentType: { key: string; label: string; value: number }[];
  byExtension: { key: string; label: string; value: number }[];
  byExtensionSize: { key: string; label: string; value: number }[];
  largestByItems: SiteList[];
  largest: SiteList[];
  stale: SiteList[];
  empty: SiteList[];
  risky: SiteList[];
  storageAvailable: boolean;
  truncated: number;
}
