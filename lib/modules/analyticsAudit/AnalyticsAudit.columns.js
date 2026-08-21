import * as React from "react";
import { Button } from "../../components/actions/Button";
import { Theme } from "../../theme/Theme.api";
import { AnalyticsAuditContent } from "./AnalyticsAudit.content";
import { formatDuration, windowOf } from "./AnalyticsAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export function entryColumns(activeWindow) {
    const measure = (entry) => windowOf(entry, activeWindow);
    return [
        {
            key: "title",
            header: AnalyticsAuditContent.columns.title,
            minWidth: 260,
            maxWidth: 380,
            sortValue: (entry) => entry.title,
            render: (entry) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, entry.title),
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-all" } }, entry.url))),
        },
        {
            key: "list",
            header: AnalyticsAuditContent.columns.list,
            minWidth: 160,
            sortValue: (entry) => entry.listTitle,
            filterValue: (entry) => entry.listTitle,
            render: (entry) => React.createElement("span", null, entry.listTitle),
        },
        {
            key: "folder",
            header: AnalyticsAuditContent.columns.folder,
            minWidth: 160,
            sortValue: (entry) => entry.folder,
            filterValue: (entry) => entry.folder || "(root)",
            render: (entry) => React.createElement("span", null, entry.folder || "(root)"),
        },
        {
            key: "orgUnit",
            header: AnalyticsAuditContent.columns.orgUnit,
            minWidth: 160,
            sortValue: (entry) => entry.orgUnit,
            filterValue: (entry) => entry.orgUnit || "-",
            render: (entry) => React.createElement("span", null, entry.orgUnit || "-"),
        },
        {
            key: "views",
            header: AnalyticsAuditContent.columns.views,
            minWidth: 110,
            sortValue: (entry) => measure(entry).views,
            render: (entry) => React.createElement("span", null, formatNumber(measure(entry).views)),
        },
        {
            key: "unique",
            header: AnalyticsAuditContent.columns.unique,
            minWidth: 110,
            sortValue: (entry) => measure(entry).unique,
            render: (entry) => React.createElement("span", null, formatNumber(measure(entry).unique)),
        },
        {
            key: "time",
            header: AnalyticsAuditContent.columns.time,
            minWidth: 120,
            sortValue: (entry) => measure(entry).timeSpentSeconds,
            render: (entry) => React.createElement("span", null, formatDuration(measure(entry).timeSpentSeconds)),
        },
        {
            key: "perView",
            header: AnalyticsAuditContent.columns.perView,
            minWidth: 110,
            sortValue: (entry) => (measure(entry).views === 0 ? 0 : measure(entry).timeSpentSeconds / measure(entry).views),
            render: (entry) => (React.createElement("span", null, measure(entry).views === 0
                ? "-"
                : formatDuration(Math.round(measure(entry).timeSpentSeconds / measure(entry).views)))),
        },
        {
            key: "modified",
            header: AnalyticsAuditContent.columns.modified,
            minWidth: 140,
            sortValue: (entry) => entry.modified,
            render: (entry) => React.createElement("span", null, entry.modified ? formatDate(entry.modified) : "-"),
        },
        {
            key: "open",
            header: AnalyticsAuditContent.columns.open,
            minWidth: 110,
            render: (entry) => (React.createElement(Button, { label: AnalyticsAuditContent.columns.open, variant: "subtle", iconName: "OpenInNewWindow", newTab: true, href: absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href) })),
        },
    ];
}
//# sourceMappingURL=AnalyticsAudit.columns.js.map