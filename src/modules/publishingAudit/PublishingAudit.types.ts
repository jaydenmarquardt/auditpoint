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
}

export interface PublishingAuditData {
  items: PublishingItem[];
  listCount: number;
  /** Lists holding content: pages, libraries, or anything with a rich text column. */
  contentListIds: string[];
  scannedSites: string[];
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
  authors: number;
  /** Items with no published version: a draft, pending, rejected or 0.x item. */
  unpublished: number;
  versionsScanned: number;
  itemsVersioned: number;
  lists: number;
}

/** One person, with everything they touched in the scan. */
export interface PublishingPerson {
  name: string;
  created: number;
  edited: number;
  unpublished: number;
  stale: number;
  lists: string[];
  lastEdit: string;
  items: PublishingItem[];
}

export interface PublishingAuditView {
  totals: PublishingTotals;
  people: PublishingPerson[];
  unpublishedItems: PublishingItem[];
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
