import { ActivityDay } from "@/api/Analytics.types";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import {
  AnalyticsAuditData,
  AnalyticsAuditView,
  AnalyticsEntry,
  AnalyticsTotals,
  WindowKey,
  WindowSummary,
} from "@/modules/analyticsAudit/AnalyticsAudit.types";

const DAY = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function windowOf(entry: AnalyticsEntry, window: WindowKey): { views: number; unique: number; timeSpentSeconds: number } {
  if (window === "last7") return entry.last7;
  if (window === "last30") return entry.last30;
  if (window === "last90") return entry.last90;
  if (window === "allTime") return entry.allTime;

  // Today is only knowable from daily rows, so it falls back to the seven day window.
  const today = new Date().toISOString().slice(0, 10);
  const row = (entry.daily ?? []).filter((day) => day.date === today)[0];
  return row ?? { views: 0, unique: 0, timeSpentSeconds: 0 };
}

export function buildView(data: Partial<AnalyticsAuditData> | undefined, window: WindowKey): AnalyticsAuditView {
  const entries = data?.entries ?? [];
  const activity = data?.activity ?? [];
  const pages = entries.filter((entry) => entry.kind === "page");
  const files = entries.filter((entry) => entry.kind === "file");

  const measure = (entry: AnalyticsEntry): { views: number; unique: number; timeSpentSeconds: number } =>
    windowOf(entry, window);

  const views = sum(entries.map((entry) => measure(entry).views));
  const unique = sum(entries.map((entry) => measure(entry).unique));
  const seconds = sum(entries.map((entry) => measure(entry).timeSpentSeconds));
  const viewed = pages.filter((page) => measure(page).views > 0);

  const busiest = [...activity].sort((first, second) => second.views - first.views)[0];
  const hourly = data?.hourly ?? [];
  const busiestHour = [...hourly].sort((first, second) => second.views - first.views)[0];

  const totals: AnalyticsTotals = {
    pages: pages.length,
    files: files.length,
    viewedPages: viewed.length,
    unviewedPages: pages.length - viewed.length,
    views,
    unique,
    // Days with any recorded view: the closest this data gets to a session count.
    visits: activity.filter((day) => day.views > 0).length,
    averageSecondsPerView: views === 0 ? 0 : Math.round(seconds / views),
    averageSecondsPerViewer: unique === 0 ? 0 : Math.round(seconds / unique),
    busiestDay: busiest ? `${busiest.date} (${busiest.views.toLocaleString()})` : "",
    busiestHour: busiestHour ? `${String(busiestHour.hour).padStart(2, "0")}:00` : "",
    days: activity.length,
  };

  return {
    totals,
    windows: windowSummaries(entries, activity),
    entries,
    pages,
    files,
    unviewed: pages.filter((page) => measure(page).views === 0),
    viewsByDay: activity.map((day) => ({ label: day.date.slice(5), value: day.views })),
    viewersByDay: activity.map((day) => ({ label: day.date.slice(5), value: day.unique })),
    viewsByHour: hourly.map((hour) => ({ label: `${String(hour.hour).padStart(2, "0")}:00`, value: hour.views })),
    viewsByWeekday: byWeekday(activity),
    viewsByFolder: rank(pages, (page) => page.folder || "(root)", measure),
    viewsByOrgUnit: rank(
      entries.filter((entry) => entry.orgUnit),
      (entry) => entry.orgUnit,
      measure
    ),
    viewsByFileType: rank(files, (file) => file.extension || "unknown", measure),
    topPages: rank(pages, (page) => page.title || page.url, measure, 12),
    topFiles: rank(files, (file) => file.title || file.url, measure, 12),
    timeByFolder: rank(pages, (page) => page.folder || "(root)", (page) => ({
      views: Math.round(measure(page).timeSpentSeconds / 60),
      unique: 0,
      timeSpentSeconds: 0,
    })),
  };
}

/** Each window against the one before it, which is what a percentage change means here. */
function windowSummaries(entries: AnalyticsEntry[], activity: ActivityDay[]): Record<WindowKey, WindowSummary> {
  const totalFor = (window: WindowKey): { views: number; unique: number; timeSpentSeconds: number } => ({
    views: sum(entries.map((entry) => windowOf(entry, window).views)),
    unique: sum(entries.map((entry) => windowOf(entry, window).unique)),
    timeSpentSeconds: sum(entries.map((entry) => windowOf(entry, window).timeSpentSeconds)),
  });

  const summary = (window: WindowKey, change: number): WindowSummary => ({ ...totalFor(window), change });

  return {
    today: summary("today", dailyChange(activity, 1)),
    last7: summary("last7", dailyChange(activity, 7)),
    last30: summary("last30", dailyChange(activity, 30)),
    last90: summary("last90", dailyChange(activity, 90)),
    allTime: summary("allTime", 0),
  };
}

/** The window against the one immediately before it, taken from the daily rows. */
function dailyChange(activity: ActivityDay[], days: number): number {
  if (activity.length === 0) return 0;

  const now = Date.now();
  const inRange = (day: ActivityDay, from: number, to: number): boolean => {
    const stamp = new Date(day.date).getTime();
    return stamp >= from && stamp < to;
  };

  const current = sum(activity.filter((day) => inRange(day, now - days * DAY, now)).map((day) => day.views));
  const before = sum(
    activity.filter((day) => inRange(day, now - days * 2 * DAY, now - days * DAY)).map((day) => day.views)
  );

  if (before === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - before) / before) * 100);
}

function byWeekday(activity: ActivityDay[]): { label: string; value: number }[] {
  const counts = new Array(7).fill(0) as number[];

  activity.forEach((day) => {
    const date = new Date(day.date);
    if (Number.isFinite(date.getTime())) counts[date.getDay()] += day.views;
  });

  return WEEKDAYS.map((label, index) => ({ label, value: counts[index] }));
}

function rank(
  entries: AnalyticsEntry[],
  key: (entry: AnalyticsEntry) => string,
  measure: (entry: AnalyticsEntry) => { views: number },
  limit = 12
): { label: string; value: number }[] {
  const totals = new Map<string, number>();
  entries.forEach((entry) => totals.set(key(entry), (totals.get(key(entry)) ?? 0) + measure(entry).views));

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .filter((point) => point.value > 0)
    .sort((first, second) => second.value - first.value)
    .slice(0, limit);
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round((seconds / 3600) * 10) / 10}h`;
}

export function windowLabel(window: WindowKey): string {
  return AnalyticsAuditContent.windows[window];
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
