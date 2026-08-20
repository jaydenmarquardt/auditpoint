import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { ListsAuditContent } from "./ListsAudit.content";
import { formatBytes, formatNumber } from "../../utils/Format.util";
export function statTiles({ view, config }) {
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
            iconName: "Clock", key: "stale",
            label: ListsAuditContent.stats.stale,
            value: formatNumber(view.totals.stale),
            tone: "warning",
            badge: view.totals.stale > 0 ? ListsAuditContent.review : undefined,
            info: ListsAuditContent.tileInfo.stale,
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
export const ListsAuditStats = (props) => (React.createElement(StatGrid, { tiles: statTiles(props), columns: 5 }));
//# sourceMappingURL=ListsAudit.stats.js.map