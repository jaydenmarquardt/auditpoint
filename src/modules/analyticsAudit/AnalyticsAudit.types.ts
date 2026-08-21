import { ActivityDay, ActivityHour, ViewTotals } from "@/api/Analytics.types";

export interface AnalyticsAuditConfig {
  days: number;
  maxPages: number;
  scanFiles: boolean;
  maxLists: number;
  maxFilesPerLibrary: number;
  orgUnitColumn: string;
  dailyDetailPages: number;
  readHourly: boolean;
}

export type AnalyticsKind = "page" | "file";

/** One page or file with the windows SharePoint reports for it. */
export interface AnalyticsEntry {
  siteUrl: string;
  kind: AnalyticsKind;
  listTitle: string;
  itemId: number;
  title: string;
  url: string;
  /** Folder the item sits in, taken from its path. */
  folder: string;
  /** Owning area, read from the column named in settings. */
  orgUnit: string;
  extension: string;
  modified: string;
  allTime: ViewTotals;
  last7: ViewTotals;
  last30: ViewTotals;
  last90: ViewTotals;
  /** Filled in for the pages the run pre-loaded detail for. */
  daily?: ActivityDay[];
}

export interface AnalyticsAuditData {
  entries: AnalyticsEntry[];
  activity: ActivityDay[];
  hourly: ActivityHour[];
  /** True when no site wide endpoint answered and the days came from page rows. */
  activitySampled: boolean;
  scannedSites: string[];
}

export type WindowKey = "today" | "last7" | "last30" | "last90" | "allTime";

export interface WindowSummary {
  views: number;
  unique: number;
  timeSpentSeconds: number;
  /** Change against the window before this one, as a percentage. */
  change: number;
}

export interface AnalyticsTotals {
  pages: number;
  files: number;
  viewedPages: number;
  unviewedPages: number;
  views: number;
  unique: number;
  visits: number;
  averageSecondsPerView: number;
  averageSecondsPerViewer: number;
  busiestDay: string;
  busiestHour: string;
  days: number;
}

export interface AnalyticsAuditView {
  totals: AnalyticsTotals;
  windows: Record<WindowKey, WindowSummary>;
  entries: AnalyticsEntry[];
  pages: AnalyticsEntry[];
  files: AnalyticsEntry[];
  unviewed: AnalyticsEntry[];
  viewsByDay: { label: string; value: number }[];
  viewersByDay: { label: string; value: number }[];
  viewsByHour: { label: string; value: number }[];
  viewsByWeekday: { label: string; value: number }[];
  viewsByFolder: { label: string; value: number }[];
  viewsByOrgUnit: { label: string; value: number }[];
  viewsByFileType: { label: string; value: number }[];
  topPages: { label: string; value: number }[];
  topFiles: { label: string; value: number }[];
  timeByFolder: { label: string; value: number }[];
}
