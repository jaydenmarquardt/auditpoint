import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { StatSectionSpec, StatSections, compareTiles, sectionsFrom } from "@/modules/shared/StatSections";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";
import { formatNumber } from "@/utils/Format.util";

interface Tile {
  key: string;
  label: string;
  value: string;
  info: string;
  tone?: "warning";
  badge?: string;
  iconName?: string;
}

export function statTiles(view: WebPartAuditView): Tile[] {
  return [
    {
      iconName: "Page", key: "pages",
      label: WebPartAuditContent.stats.pages,
      value: formatNumber(view.totals.pages),
      info: WebPartAuditContent.tileInfo.pages,
    },
    {
      iconName: "Puzzle", key: "instances",
      label: WebPartAuditContent.stats.instances,
      value: formatNumber(view.totals.instances),
      info: WebPartAuditContent.tileInfo.instances,
    },
    {
      iconName: "ContextMenu", key: "types",
      label: WebPartAuditContent.stats.types,
      value: formatNumber(view.totals.types),
      info: WebPartAuditContent.tileInfo.types,
    },
    {
      iconName: "Package", key: "thirdParty",
      label: WebPartAuditContent.stats.thirdParty,
      value: formatNumber(view.totals.thirdParty),
      info: WebPartAuditContent.tileInfo.thirdParty,
      tone: "warning",
      badge: view.totals.thirdParty > 0 ? "Review" : undefined,
    },
    {
      iconName: "Calculator", key: "average",
      label: WebPartAuditContent.stats.average,
      value: String(view.totals.averagePerPage),
      info: WebPartAuditContent.tileInfo.average,
    },
    {
      iconName: "FieldEmpty", key: "empty",
      label: WebPartAuditContent.stats.empty,
      value: formatNumber(view.totals.emptyPages),
      info: WebPartAuditContent.tileInfo.empty,
    },
    {
      iconName: "TextField", key: "text",
      label: WebPartAuditContent.stats.text,
      value: formatNumber(view.totals.textBlocks),
      info: WebPartAuditContent.tileInfo.text,
    },
  ];
}

export const WebPartAuditStats: React.FC<{ view: WebPartAuditView; previousTiles?: StatTileSpec[] }> = ({ view , previousTiles}) => (
  <StatSections sections={sectionsFrom(compareTiles(statTiles(view), previousTiles), STAT_SECTIONS)} />
);

/** Grouped so the overview answers one question at a time. */
export const STAT_SECTIONS: StatSectionSpec[] = [
  { title: "Placement", keys: ["pages", "instances", "types", "average"] },
  { title: "Needs attention", keys: ["thirdParty", "empty", "text"] },
];
