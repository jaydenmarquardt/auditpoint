import * as React from "react";
import { StatSectionSpec, StatSections, compareTiles, sectionsFrom } from "@/modules/shared/StatSections";
import { StatTileSpec } from "@/components/Components.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditConfig, PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";
import { formatNumber } from "@/utils/Format.util";

export function statTiles(view: PublishingAuditView, config: PublishingAuditConfig): StatTileSpec[] {
  const { totals } = view;

  return [
    { iconName: "BulletedList", key: "items", label: PublishingAuditContent.stats.items, value: formatNumber(totals.items), info: PublishingAuditContent.tileInfo.items },
    { iconName: "BulletedList", key: "lists", label: PublishingAuditContent.stats.lists, value: formatNumber(totals.lists), info: PublishingAuditContent.tileInfo.lists },
    { iconName: "CompletedSolid", key: "approved", label: PublishingAuditContent.stats.approved, value: formatNumber(totals.approved), info: PublishingAuditContent.tileInfo.approved },
    {
      iconName: "Clock", key: "pending",
      label: PublishingAuditContent.stats.pending,
      value: formatNumber(totals.pending),
      tone: "warning",
      badge: totals.pending > 0 ? PublishingAuditContent.review : undefined,
      info: PublishingAuditContent.tileInfo.pending,
    },
    { iconName: "PageEdit", key: "draft", label: PublishingAuditContent.stats.draft, value: formatNumber(totals.draft), tone: "warning", info: PublishingAuditContent.tileInfo.draft },
    { iconName: "ErrorBadge", key: "rejected", label: PublishingAuditContent.stats.rejected, value: formatNumber(totals.rejected), info: PublishingAuditContent.tileInfo.rejected },
    { key: "created", label: `${PublishingAuditContent.stats.created} (${config.months}m)`, value: formatNumber(totals.createdInWindow), info: PublishingAuditContent.tileInfo.created },
    { key: "modified", label: `${PublishingAuditContent.stats.modified} (${config.months}m)`, value: formatNumber(totals.modifiedInWindow), info: PublishingAuditContent.tileInfo.modified },
    {
      key: "stale",
      label: `${PublishingAuditContent.stats.stale} (${config.staleDays}d)`,
      value: formatNumber(totals.stale),
      tone: "warning",
      badge: totals.stale > 0 ? PublishingAuditContent.review : undefined,
      info: PublishingAuditContent.tileInfo.stale,
    },
    { iconName: "Blocked", key: "never", label: PublishingAuditContent.stats.never, value: formatNumber(totals.neverEdited), info: PublishingAuditContent.tileInfo.never },
    {
      iconName: "Clock", key: "due",
      label: PublishingAuditContent.stats.due,
      value: formatNumber(totals.dueForReview),
      tone: "danger",
      info: PublishingAuditContent.tileInfo.due,
    },
    {
      iconName: "EventDeclined", key: "expired",
      label: PublishingAuditContent.stats.expired,
      value: formatNumber(totals.expired),
      tone: "danger",
      info: PublishingAuditContent.tileInfo.expired,
    },
    {
      key: "versionsScanned",
      label: PublishingAuditContent.stats.versionsScanned,
      value: formatNumber(totals.versionsScanned),
      unavailable: !(config.readVersions),
      hint: config.readVersions ? `${formatNumber(totals.itemsVersioned)} items` : undefined,
      info: PublishingAuditContent.tileInfo.versionsScanned,
    },
    {
      key: "versions",
      label: PublishingAuditContent.stats.versions,
      value: String(totals.averageVersions),
      unavailable: !(config.readVersions),
      hint: config.readVersions ? `${formatNumber(totals.maxVersions)} deepest` : undefined,
      info: PublishingAuditContent.tileInfo.versions,
    },
    { iconName: "EditContact", key: "editors", label: PublishingAuditContent.stats.editors, value: formatNumber(totals.editors), info: PublishingAuditContent.tileInfo.editors },
    { iconName: "Contact", key: "authors", label: PublishingAuditContent.stats.authors, value: formatNumber(totals.authors), info: PublishingAuditContent.tileInfo.authors },
    {
      iconName: "PageRemove",
      key: "unpublished",
      label: PublishingAuditContent.stats.unpublished,
      value: formatNumber(totals.unpublished),
      tone: "warning",
      badge: totals.unpublished > 0 ? PublishingAuditContent.review : undefined,
      info: PublishingAuditContent.tileInfo.unpublished,
    },
  ];
}

export const PublishingAuditStats: React.FC<{
  view: PublishingAuditView;
  config: PublishingAuditConfig;
  previousTiles?: StatTileSpec[];
}> = ({ view, config, previousTiles }) => (
  <StatSections sections={sectionsFrom(compareTiles(statTiles(view, config), previousTiles), STAT_SECTIONS)} />
);

/** Grouped so the overview answers one question at a time. */
export const STAT_SECTIONS: StatSectionSpec[] = [
  { title: "Approval", keys: ["items", "lists", "approved", "pending", "draft", "rejected", "unpublished"] },
  { title: "Freshness", keys: ["created", "modified", "stale", "never"] },
  { title: "Dates and versions", keys: ["due", "expired", "versionsScanned", "versions"] },
  { title: "People", keys: ["editors", "authors"] },
];
