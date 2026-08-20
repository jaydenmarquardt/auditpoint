import { PublishingItem } from "@/api/Publishing.types";

export interface PublishingAuditConfig {
  months: number;
  staleDays: number;
  listScope: string;
  listNames: string;
  includeHidden: boolean;
  maxLists: number;
  maxItemsPerList: number;
  dateColumns: string;
  readVersions: boolean;
  versionDepth: number;
  versionSample: number;
  readPopularity: boolean;
}

export interface PublishingAuditData {
  items: PublishingItem[];
  listCount: number;
  scannedSites: string[];
  popularityRead: boolean;
}

export interface PublishingTotals {
  items: number;
  approved: number;
  pending: number;
  draft: number;
  rejected: number;
  scheduled: number;
  createdInWindow: number;
  modifiedInWindow: number;
  stale: number;
  neverEdited: number;
  dueForReview: number;
  expired: number;
  averageVersions: number;
  maxVersions: number;
  editors: number;
  viewsRecent: number;
  unviewed: number;
  versionsScanned: number;
  itemsVersioned: number;
  lists: number;
}

export interface PublishingAuditView {
  totals: PublishingTotals;
  createdByMonth: { label: string; value: number }[];
  modifiedByMonth: { label: string; value: number }[];
  modifiedByWeekday: { label: string; value: number }[];
  statusSplit: { label: string; value: number }[];
  topEditors: { label: string; value: number }[];
  stalenessSplit: { label: string; value: number }[];
  itemsByList: { label: string; value: number }[];
  reviewItems: PublishingItem[];
  staleItems: PublishingItem[];
}
