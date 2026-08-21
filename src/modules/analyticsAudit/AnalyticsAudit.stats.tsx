import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { StatSectionSpec, StatSections, compareTiles, sectionsFrom } from "@/modules/shared/StatSections";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView, WindowKey } from "@/modules/analyticsAudit/AnalyticsAudit.types";
import { formatDuration } from "@/modules/analyticsAudit/AnalyticsAudit.logic";
import { formatNumber } from "@/utils/Format.util";

export function statTiles(view: AnalyticsAuditView, window: WindowKey): StatTileSpec[] {
  const { totals } = view;
  const change = view.windows[window]?.change ?? 0;

  return [
    {
      key: "views",
      label: AnalyticsAuditContent.stats.views,
      value: formatNumber(totals.views),
      iconName: "View",
      hint: window === "allTime" ? undefined : `${change > 0 ? "+" : ""}${change}% on the window before`,
      info: AnalyticsAuditContent.tileInfo.views,
    },
    { key: "unique", label: AnalyticsAuditContent.stats.unique, value: formatNumber(totals.unique), iconName: "People", info: AnalyticsAuditContent.tileInfo.unique },
    { key: "visits", label: AnalyticsAuditContent.stats.visits, value: formatNumber(totals.visits), iconName: "Calendar", info: AnalyticsAuditContent.tileInfo.visits },
    { key: "timePerView", label: AnalyticsAuditContent.stats.timePerView, value: formatDuration(totals.averageSecondsPerView), iconName: "Clock", info: AnalyticsAuditContent.tileInfo.timePerView },
    { key: "timePerViewer", label: AnalyticsAuditContent.stats.timePerViewer, value: formatDuration(totals.averageSecondsPerViewer), iconName: "Timer", info: AnalyticsAuditContent.tileInfo.timePerViewer },
    { key: "busiestDay", label: AnalyticsAuditContent.stats.busiestDay, value: totals.busiestDay || "-", iconName: "Calendar", unavailable: !totals.busiestDay, info: AnalyticsAuditContent.tileInfo.busiestDay },
    { key: "busiestHour", label: AnalyticsAuditContent.stats.busiestHour, value: totals.busiestHour || "-", iconName: "Clock", unavailable: !totals.busiestHour, info: AnalyticsAuditContent.tileInfo.busiestHour },
    { key: "days", label: AnalyticsAuditContent.stats.days, value: formatNumber(totals.days), iconName: "CalendarWeek", info: AnalyticsAuditContent.tileInfo.days },
    { key: "pages", label: AnalyticsAuditContent.stats.pages, value: formatNumber(totals.pages), iconName: "Page", info: AnalyticsAuditContent.tileInfo.pages },
    { key: "files", label: AnalyticsAuditContent.stats.files, value: formatNumber(totals.files), iconName: "TextDocument", info: AnalyticsAuditContent.tileInfo.files },
    { key: "viewed", label: AnalyticsAuditContent.stats.viewed, value: formatNumber(totals.viewedPages), iconName: "RedEye", info: AnalyticsAuditContent.tileInfo.viewed },
    {
      key: "unviewed",
      label: AnalyticsAuditContent.stats.unviewed,
      value: formatNumber(totals.unviewedPages),
      tone: "warning",
      badge: totals.unviewedPages > 0 ? AnalyticsAuditContent.review : undefined,
      iconName: "Hide",
      info: AnalyticsAuditContent.tileInfo.unviewed,
    },
  ];
}

export const STAT_SECTIONS: StatSectionSpec[] = [
  { title: AnalyticsAuditContent.sections.traffic, keys: ["views", "unique", "visits", "timePerView", "timePerViewer"] },
  { title: AnalyticsAuditContent.sections.audience, keys: ["busiestDay", "busiestHour", "days"] },
  { title: AnalyticsAuditContent.sections.content, keys: ["pages", "files", "viewed", "unviewed"] },
];

export const AnalyticsAuditStats: React.FC<{
  view: AnalyticsAuditView;
  window: WindowKey;
  previousTiles?: StatTileSpec[];
}> = ({ view, window, previousTiles }) => (
  <StatSections sections={sectionsFrom(compareTiles(statTiles(view, window), previousTiles), STAT_SECTIONS)} />
);
