import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
import { StatTileSpec } from "@/components/Components.types";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";
import { formatBytes, formatNumber } from "@/utils/Format.util";

export function statTiles(view: ImagesAuditView): StatTileSpec[] {
  const { totals } = view;

  return [
    { key: "files", label: ImagesAuditContent.stats.files, value: formatNumber(totals.files), info: ImagesAuditContent.tileInfo.files },
    { key: "storage", label: ImagesAuditContent.stats.storage, value: formatBytes(totals.storageBytes), info: ImagesAuditContent.tileInfo.storage },
    { key: "average", label: ImagesAuditContent.stats.average, value: formatBytes(totals.averageBytes), info: ImagesAuditContent.tileInfo.average },
    { key: "usages", label: ImagesAuditContent.stats.usages, value: formatNumber(totals.usages), info: ImagesAuditContent.tileInfo.usages },
    { key: "used", label: ImagesAuditContent.stats.used, value: formatNumber(totals.usedFiles), info: ImagesAuditContent.tileInfo.used },
    {
      key: "unused",
      label: ImagesAuditContent.stats.unused,
      value: formatNumber(totals.unusedFiles),
      tone: "warning",
      badge: totals.unusedFiles > 0 ? ImagesAuditContent.review : undefined,
      info: ImagesAuditContent.tileInfo.unused,
    },
    { key: "unusedBytes", label: ImagesAuditContent.stats.unusedBytes, value: formatBytes(totals.unusedBytes), info: ImagesAuditContent.tileInfo.unusedBytes },
    {
      key: "duplicates",
      label: ImagesAuditContent.stats.duplicates,
      value: formatNumber(totals.duplicateFiles),
      tone: "warning",
      info: ImagesAuditContent.tileInfo.duplicates,
    },
    { key: "duplicateBytes", label: ImagesAuditContent.stats.duplicateBytes, value: formatBytes(totals.duplicateBytes), info: ImagesAuditContent.tileInfo.duplicateBytes },
    {
      key: "alt",
      label: ImagesAuditContent.stats.alt,
      value: formatNumber(totals.missingAlt),
      tone: "danger",
      badge: totals.missingAlt > 0 ? ImagesAuditContent.review : undefined,
      info: ImagesAuditContent.tileInfo.alt,
    },
    { key: "external", label: ImagesAuditContent.stats.external, value: formatNumber(totals.externalImages), tone: "warning", info: ImagesAuditContent.tileInfo.external },
    { key: "oversized", label: ImagesAuditContent.stats.oversized, value: formatNumber(totals.oversized), tone: "warning", info: ImagesAuditContent.tileInfo.oversized },
    { key: "legacy", label: ImagesAuditContent.stats.legacy, value: formatNumber(totals.legacyFormats), info: ImagesAuditContent.tileInfo.legacy },
    { key: "formats", label: ImagesAuditContent.stats.formats, value: formatNumber(totals.formats), info: ImagesAuditContent.tileInfo.formats },
  ];
}

export const ImagesAuditStats: React.FC<{ view: ImagesAuditView }> = ({ view }) => (
  <StatGrid tiles={statTiles(view)} columns={5} />
);
