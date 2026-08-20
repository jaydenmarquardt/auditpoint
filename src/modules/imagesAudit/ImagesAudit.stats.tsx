import * as React from "react";
import { StatSectionSpec, StatSections, compareTiles, sectionsFrom } from "@/modules/shared/StatSections";
import { StatTileSpec } from "@/components/Components.types";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";
import { formatBytes, formatNumber } from "@/utils/Format.util";

export function statTiles(view: ImagesAuditView): StatTileSpec[] {
  const { totals } = view;

  return [
    { iconName: "Page", key: "files", label: ImagesAuditContent.stats.files, value: formatNumber(totals.files), info: ImagesAuditContent.tileInfo.files },
    { iconName: "Database", key: "storage", label: ImagesAuditContent.stats.storage, value: formatBytes(totals.storageBytes), info: ImagesAuditContent.tileInfo.storage },
    { iconName: "Calculator", key: "average", label: ImagesAuditContent.stats.average, value: formatBytes(totals.averageBytes), info: ImagesAuditContent.tileInfo.average },
    { iconName: "Link", key: "usages", label: ImagesAuditContent.stats.usages, value: formatNumber(totals.usages), info: ImagesAuditContent.tileInfo.usages },
    { iconName: "CheckMark", key: "used", label: ImagesAuditContent.stats.used, value: formatNumber(totals.usedFiles), info: ImagesAuditContent.tileInfo.used },
    {
      iconName: "Blocked", key: "unused",
      label: ImagesAuditContent.stats.unused,
      value: formatNumber(totals.unusedFiles),
      tone: "warning",
      badge: totals.unusedFiles > 0 ? ImagesAuditContent.review : undefined,
      info: ImagesAuditContent.tileInfo.unused,
    },
    { iconName: "Database", key: "unusedBytes", label: ImagesAuditContent.stats.unusedBytes, value: formatBytes(totals.unusedBytes), info: ImagesAuditContent.tileInfo.unusedBytes },
    {
      iconName: "Copy", key: "duplicates",
      label: ImagesAuditContent.stats.duplicates,
      value: formatNumber(totals.duplicateFiles),
      tone: "warning",
      info: ImagesAuditContent.tileInfo.duplicates,
    },
    { iconName: "Copy", key: "duplicateBytes", label: ImagesAuditContent.stats.duplicateBytes, value: formatBytes(totals.duplicateBytes), info: ImagesAuditContent.tileInfo.duplicateBytes },
    {
      iconName: "Photo2", key: "alt",
      label: ImagesAuditContent.stats.alt,
      value: formatNumber(totals.missingAlt),
      tone: "danger",
      badge: totals.missingAlt > 0 ? ImagesAuditContent.review : undefined,
      info: ImagesAuditContent.tileInfo.alt,
    },
    { iconName: "Globe", key: "external", label: ImagesAuditContent.stats.external, value: formatNumber(totals.externalImages), tone: "warning", info: ImagesAuditContent.tileInfo.external },
    { iconName: "Weights", key: "oversized", label: ImagesAuditContent.stats.oversized, value: formatNumber(totals.oversized), tone: "warning", info: ImagesAuditContent.tileInfo.oversized },
    { iconName: "History", key: "legacy", label: ImagesAuditContent.stats.legacy, value: formatNumber(totals.legacyFormats), info: ImagesAuditContent.tileInfo.legacy },
    { iconName: "FileImage", key: "formats", label: ImagesAuditContent.stats.formats, value: formatNumber(totals.formats), info: ImagesAuditContent.tileInfo.formats },
  ];
}

export const ImagesAuditStats: React.FC<{ view: ImagesAuditView; previousTiles?: StatTileSpec[] }> = ({ view , previousTiles}) => (
  <StatSections sections={sectionsFrom(compareTiles(statTiles(view), previousTiles), STAT_SECTIONS)} />
);

/** Grouped so the overview answers one question at a time. */
export const STAT_SECTIONS: StatSectionSpec[] = [
  { title: "Files", keys: ["files", "storage", "average", "formats"] },
  { title: "Use", keys: ["usages", "used", "unused", "unusedBytes"] },
  { title: "Needs attention", keys: ["alt", "duplicates", "duplicateBytes", "oversized", "external", "legacy"] },
];
