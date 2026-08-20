import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
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
      key: "lists",
      label: ListsAuditContent.stats.lists,
      value: formatNumber(view.totals.lists),
      info: ListsAuditContent.tileInfo.lists,
    },
    {
      key: "libraries",
      label: ListsAuditContent.stats.libraries,
      value: formatNumber(view.totals.libraries),
      info: ListsAuditContent.tileInfo.libraries,
    },
    {
      key: "items",
      label: ListsAuditContent.stats.items,
      value: formatNumber(view.totals.items),
      info: ListsAuditContent.tileInfo.items,
    },
    {
      key: "folders",
      label: ListsAuditContent.stats.folders,
      value: config.scanItems ? formatNumber(view.totals.folders) : "-",
      info: ListsAuditContent.tileInfo.folders,
    },
    {
      key: "files",
      label: ListsAuditContent.stats.files,
      value: config.scanItems ? formatNumber(view.totals.files) : "-",
      info: ListsAuditContent.tileInfo.files,
    },
    {
      key: "contentTypes",
      label: ListsAuditContent.stats.contentTypes,
      value: formatNumber(view.totals.contentTypes),
      info: ListsAuditContent.tileInfo.contentTypes,
    },
    {
      key: "storage",
      label: ListsAuditContent.stats.storage,
      value: view.storageAvailable ? formatBytes(view.totals.storageBytes) : "-",
      hint: view.storageAvailable ? undefined : ListsAuditContent.storageUnavailableShort,
      info: ListsAuditContent.tileInfo.storage,
    },
    {
      key: "stale",
      label: ListsAuditContent.stats.stale,
      value: formatNumber(view.totals.stale),
      tone: "warning",
      badge: view.totals.stale > 0 ? ListsAuditContent.review : undefined,
      info: ListsAuditContent.tileInfo.stale,
    },
    {
      key: "empty",
      label: ListsAuditContent.stats.empty,
      value: formatNumber(view.totals.empty),
      info: ListsAuditContent.tileInfo.empty,
    },
    {
      key: "governance",
      label: ListsAuditContent.stats.governance,
      value: formatNumber(view.totals.noVersioning + view.totals.uniquePermissions),
      tone: "warning",
      info: ListsAuditContent.tileInfo.governance,
    },
  ];
}

export const ListsAuditStats: React.FC<ListsAuditStatsProps> = (props) => (
  <StatGrid tiles={statTiles(props)} columns={5} />
);
