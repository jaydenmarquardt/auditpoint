import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Button } from "../../components/actions/Button";
import { Theme } from "../../theme/Theme.api";
import { ImagesAuditContent } from "./ImagesAudit.content";
import { flagsFor } from "./ImagesAudit.logic";
import { formatBytes, formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export const fileColumns = [
    {
        key: "name",
        header: ImagesAuditContent.columns.name,
        minWidth: 280,
        maxWidth: 380,
        sortValue: (file) => file.name,
        render: (file) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, file.name),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, file.url))),
    },
    {
        key: "list",
        header: ImagesAuditContent.columns.list,
        minWidth: 180,
        sortValue: (file) => file.listTitle,
        filterValue: (file) => file.listTitle,
        render: (file) => React.createElement("span", null, file.listTitle),
    },
    {
        key: "format",
        header: ImagesAuditContent.columns.format,
        minWidth: 120,
        sortValue: (file) => file.extension,
        filterValue: (file) => file.extension || "unknown",
        render: (file) => React.createElement(Badge, { label: file.extension || "unknown", tone: "neutral", showIcon: false }),
    },
    {
        key: "size",
        header: ImagesAuditContent.columns.size,
        minWidth: 120,
        sortValue: (file) => file.sizeBytes,
        render: (file) => React.createElement("span", null, formatBytes(file.sizeBytes)),
    },
    {
        key: "uses",
        header: ImagesAuditContent.columns.uses,
        minWidth: 100,
        sortValue: (file) => file.useCount,
        render: (file) => (React.createElement(Badge, { label: formatNumber(file.useCount), tone: file.useCount === 0 ? "warning" : "neutral", showIcon: false })),
    },
    {
        key: "modified",
        header: ImagesAuditContent.columns.modified,
        minWidth: 150,
        sortValue: (file) => file.modified,
        render: (file) => React.createElement("span", null, file.modified ? formatDate(file.modified) : "-"),
    },
    {
        key: "flags",
        header: ImagesAuditContent.columns.flags,
        minWidth: 240,
        filterValue: (file) => { var _a; return (_a = flagsFor(file)[0]) !== null && _a !== void 0 ? _a : "Clean"; },
        render: (file) => {
            const flags = flagsFor(file);
            return flags.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, flags.map((flag) => (React.createElement(Badge, { key: flag, label: flag, tone: "warning", showIcon: false })))));
        },
    },
    {
        key: "actions",
        header: ImagesAuditContent.columns.actions,
        minWidth: 110,
        render: (file) => (React.createElement(Button, { label: ImagesAuditContent.open, variant: "subtle", iconName: "OpenInNewWindow", href: absoluteFromServerRelative(file.url, file.siteUrl || window.location.href) })),
    },
];
export const usageColumns = [
    {
        key: "title",
        header: ImagesAuditContent.columns.page,
        minWidth: 260,
        maxWidth: 360,
        sortValue: (usage) => usage.title,
        filterValue: (usage) => usage.title,
        render: (usage) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, usage.title),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, usage.pageUrl))),
    },
    {
        key: "list",
        header: ImagesAuditContent.columns.list,
        minWidth: 170,
        sortValue: (usage) => usage.listTitle,
        filterValue: (usage) => usage.listTitle,
        render: (usage) => React.createElement("span", null, usage.listTitle),
    },
    {
        key: "src",
        header: ImagesAuditContent.columns.src,
        minWidth: 300,
        maxWidth: 420,
        sortValue: (usage) => usage.src,
        render: (usage) => (React.createElement("span", { style: { wordBreak: "break-all", fontSize: Theme.tokens.font.sm } }, usage.src || "-")),
    },
    {
        key: "alt",
        header: ImagesAuditContent.columns.alt,
        minWidth: 220,
        sortValue: (usage) => usage.alt,
        filterValue: (usage) => (usage.hasAlt ? ImagesAuditContent.withAlt : ImagesAuditContent.withoutAlt),
        render: (usage) => usage.hasAlt ? (React.createElement("span", null, usage.alt)) : (React.createElement(Badge, { label: ImagesAuditContent.flags.missingAlt, tone: "danger", showIcon: false })),
    },
    {
        key: "dimensions",
        header: ImagesAuditContent.columns.dimensions,
        minWidth: 150,
        sortValue: (usage) => `${usage.width}x${usage.height}`,
        render: (usage) => React.createElement("span", null, usage.width || usage.height ? `${usage.width || "?"} x ${usage.height || "?"}` : "-"),
    },
    {
        key: "external",
        header: ImagesAuditContent.columns.flags,
        minWidth: 160,
        filterValue: (usage) => (usage.isExternal ? ImagesAuditContent.flags.external : "Same tenant"),
        render: (usage) => usage.isExternal ? (React.createElement(Badge, { label: ImagesAuditContent.flags.external, tone: "warning", showIcon: false })) : (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")),
    },
];
//# sourceMappingURL=ImagesAudit.columns.js.map