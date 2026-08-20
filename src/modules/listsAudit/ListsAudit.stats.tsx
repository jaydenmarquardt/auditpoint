import * as React from "react";
import { StatSectionSpec, StatSections, compareTiles, sectionsFrom } from "@/modules/shared/StatSections";
import { StatTileSpec } from "@/components/Components.types";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditConfig, ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";
import { formatBytes, formatNumber } from "@/utils/Format.util";

export interface ListsAuditStatsProps {
  view: ListsAuditView;
  config: ListsAuditConfig;
}

export function statTiles({ view, config }: ListsAuditStatsProps): StatTileSpec[] {
  return [
    {
      iconName: "BulletedList", key: "lists",
      label: ListsAuditContent.stats.lists,
      value: formatNumber(view.totals.lists),
      info: ListsAuditContent.tileInfo.lists,
    },
    {
      iconName: "FabricFolder", key: "libraries",
      label: ListsAuditContent.stats.libraries,
      value: formatNumber(view.totals.libraries),
      info: ListsAuditContent.tileInfo.libraries,
    },
    {
      iconName: "BulletedList", key: "items",
      label: ListsAuditContent.stats.items,
      value: formatNumber(view.totals.items),
      info: ListsAuditContent.tileInfo.items,
    },
    {
      iconName: "FabricFolder", key: "folders",
      label: ListsAuditContent.stats.folders,
      value: formatNumber(view.totals.folders),
      unavailable: !(config.scanItems),
      info: ListsAuditContent.tileInfo.folders,
    },
    {
      iconName: "Page", key: "files",
      label: ListsAuditContent.stats.files,
      value: formatNumber(view.totals.files),
      unavailable: !(config.scanItems),
      info: ListsAuditContent.tileInfo.files,
    },
    {
      iconName: "ContextMenu", key: "contentTypes",
      label: ListsAuditContent.stats.contentTypes,
      value: formatNumber(view.totals.contentTypes),
      info: ListsAuditContent.tileInfo.contentTypes,
    },
    {
      iconName: "Database", key: "storage",
      label: ListsAuditContent.stats.storage,
      value: formatBytes(view.totals.storageBytes),
      unavailable: !(view.storageAvailable),
      hint: view.storageAvailable ? undefined : ListsAuditContent.storageUnavailableShort,
      info: ListsAuditContent.tileInfo.storage,
    },
    
    {
      iconName: "FieldEmpty", key: "empty",
      label: ListsAuditContent.stats.empty,
      value: formatNumber(view.totals.empty),
      info: ListsAuditContent.tileInfo.empty,
    },
    {
      iconName: "Shield", key: "governance",
      label: ListsAuditContent.stats.governance,
      value: formatNumber(view.totals.noVersioning + view.totals.uniquePermissions),
      tone: "warning",
      info: ListsAuditContent.tileInfo.governance,
    },
  ];
}

export const ListsAuditStats: React.FC<ListsAuditStatsProps & { previousTiles?: StatTileSpec[] }> = ({
  previousTiles,
  ...props
}) => <StatSections sections={sectionsFrom(compareTiles(statTiles(props), previousTiles), STAT_SECTIONS)} />;

/** Grouped so the overview answers one question at a time. */
export const STAT_SECTIONS: StatSectionSpec[] = [
  { title: "Inventory", keys: ["lists", "libraries", "items", "folders", "files", "contentTypes"] },
  { title: "Storage", keys: ["storage"] },
  { title: "Needs attention", keys: ["empty", "governance"] },
];
