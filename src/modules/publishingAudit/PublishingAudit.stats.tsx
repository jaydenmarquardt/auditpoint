import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
import { StatTileSpec } from "@/components/Components.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditConfig, PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";
import { formatNumber } from "@/utils/Format.util";

export function statTiles(view: PublishingAuditView, config: PublishingAuditConfig): StatTileSpec[] {
  const { totals } = view;

  return [
    { key: "items", label: PublishingAuditContent.stats.items, value: formatNumber(totals.items), info: PublishingAuditContent.tileInfo.items },
    { key: "lists", label: PublishingAuditContent.stats.lists, value: formatNumber(totals.lists), info: PublishingAuditContent.tileInfo.lists },
    { key: "approved", label: PublishingAuditContent.stats.approved, value: formatNumber(totals.approved), info: PublishingAuditContent.tileInfo.approved },
    {
      key: "pending",
      label: PublishingAuditContent.stats.pending,
      value: formatNumber(totals.pending),
      tone: "warning",
      badge: totals.pending > 0 ? PublishingAuditContent.review : undefined,
      info: PublishingAuditContent.tileInfo.pending,
    },
    { key: "draft", label: PublishingAuditContent.stats.draft, value: formatNumber(totals.draft), tone: "warning", info: PublishingAuditContent.tileInfo.draft },
    { key: "rejected", label: PublishingAuditContent.stats.rejected, value: formatNumber(totals.rejected), info: PublishingAuditContent.tileInfo.rejected },
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
    { key: "never", label: PublishingAuditContent.stats.never, value: formatNumber(totals.neverEdited), info: PublishingAuditContent.tileInfo.never },
    {
      key: "due",
      label: PublishingAuditContent.stats.due,
      value: formatNumber(totals.dueForReview),
      tone: "danger",
      info: PublishingAuditContent.tileInfo.due,
    },
    {
      key: "expired",
      label: PublishingAuditContent.stats.expired,
      value: formatNumber(totals.expired),
      tone: "danger",
      info: PublishingAuditContent.tileInfo.expired,
    },
    {
      key: "versionsScanned",
      label: PublishingAuditContent.stats.versionsScanned,
      value: config.readVersions ? formatNumber(totals.versionsScanned) : "-",
      hint: config.readVersions ? `${formatNumber(totals.itemsVersioned)} items` : undefined,
      info: PublishingAuditContent.tileInfo.versionsScanned,
    },
    {
      key: "versions",
      label: PublishingAuditContent.stats.versions,
      value: config.readVersions ? String(totals.averageVersions) : "-",
      hint: config.readVersions ? `${formatNumber(totals.maxVersions)} deepest` : undefined,
      info: PublishingAuditContent.tileInfo.versions,
    },
    { key: "editors", label: PublishingAuditContent.stats.editors, value: formatNumber(totals.editors), info: PublishingAuditContent.tileInfo.editors },
    {
      key: "views",
      label: PublishingAuditContent.stats.views,
      value: config.readPopularity ? formatNumber(totals.viewsRecent) : "-",
      info: PublishingAuditContent.tileInfo.views,
    },
    {
      key: "unviewed",
      label: PublishingAuditContent.stats.unviewed,
      value: config.readPopularity ? formatNumber(totals.unviewed) : "-",
      tone: "warning",
      info: PublishingAuditContent.tileInfo.unviewed,
    },
  ];
}

export const PublishingAuditStats: React.FC<{
  view: PublishingAuditView;
  config: PublishingAuditConfig;
}> = ({ view, config }) => <StatGrid tiles={statTiles(view, config)} columns={5} />;
