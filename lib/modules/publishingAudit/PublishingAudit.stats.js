import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { formatNumber } from "../../utils/Format.util";
export function statTiles(view, config) {
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
        {
            iconName: "View", key: "views",
            label: PublishingAuditContent.stats.views,
            value: formatNumber(totals.viewsRecent),
            unavailable: !(config.readPopularity),
            info: PublishingAuditContent.tileInfo.views,
        },
        {
            iconName: "Hide", key: "unviewed",
            label: PublishingAuditContent.stats.unviewed,
            value: formatNumber(totals.unviewed),
            unavailable: !(config.readPopularity),
            tone: "warning",
            info: PublishingAuditContent.tileInfo.unviewed,
        },
    ];
}
export const PublishingAuditStats = ({ view, config }) => React.createElement(StatGrid, { tiles: statTiles(view, config), columns: 5 });
//# sourceMappingURL=PublishingAudit.stats.js.map