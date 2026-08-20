import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Button } from "../../components/actions/Button";
import { Theme } from "../../theme/Theme.api";
import { ContentAuditContent } from "./ContentAudit.content";
import { issuesFor } from "./ContentAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export function entryColumns(thinWordCount) {
    return [
        {
            key: "title",
            header: ContentAuditContent.columns.title,
            minWidth: 280,
            maxWidth: 380,
            sortValue: (entry) => entry.title,
            render: (entry) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, entry.title || "-"),
                React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, entry.url))),
        },
        {
            key: "source",
            header: ContentAuditContent.columns.source,
            minWidth: 130,
            sortValue: (entry) => entry.source,
            filterValue: (entry) => ContentAuditContent.sources[entry.source],
            render: (entry) => React.createElement(Badge, { label: ContentAuditContent.sources[entry.source], tone: "neutral", showIcon: false }),
        },
        {
            key: "list",
            header: ContentAuditContent.columns.list,
            minWidth: 180,
            sortValue: (entry) => entry.listTitle,
            filterValue: (entry) => entry.listTitle,
            render: (entry) => React.createElement("span", null, entry.listTitle),
        },
        {
            key: "column",
            header: ContentAuditContent.columns.column,
            minWidth: 150,
            sortValue: (entry) => entry.column,
            filterValue: (entry) => entry.column,
            render: (entry) => React.createElement("code", { style: { fontSize: Theme.tokens.font.sm } }, entry.column),
        },
        {
            key: "words",
            header: ContentAuditContent.columns.words,
            minWidth: 110,
            sortValue: (entry) => entry.words,
            render: (entry) => React.createElement("span", null, formatNumber(entry.words)),
        },
        {
            key: "headings",
            header: ContentAuditContent.columns.headings,
            minWidth: 120,
            sortValue: (entry) => entry.headings,
            render: (entry) => React.createElement("span", null, formatNumber(entry.headings)),
        },
        {
            key: "images",
            header: ContentAuditContent.columns.images,
            minWidth: 110,
            sortValue: (entry) => entry.images,
            render: (entry) => React.createElement("span", null, formatNumber(entry.images)),
        },
        {
            key: "links",
            header: ContentAuditContent.columns.links,
            minWidth: 110,
            sortValue: (entry) => entry.links,
            render: (entry) => React.createElement("span", null, formatNumber(entry.links)),
        },
        {
            key: "modified",
            header: ContentAuditContent.columns.modified,
            minWidth: 150,
            sortValue: (entry) => entry.modified,
            render: (entry) => React.createElement("span", null, entry.modified ? formatDate(entry.modified) : "-"),
        },
        {
            key: "issues",
            header: ContentAuditContent.columns.issues,
            minWidth: 240,
            filterValue: (entry) => { var _a; return (_a = issuesFor(entry, thinWordCount)[0]) !== null && _a !== void 0 ? _a : ContentAuditContent.issues.none; },
            render: (entry) => {
                const issues = issuesFor(entry, thinWordCount);
                return issues.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, issues.map((issue) => (React.createElement(Badge, { key: issue, label: issue, tone: "warning", showIcon: false })))));
            },
        },
        {
            key: "actions",
            header: ContentAuditContent.columns.actions,
            minWidth: 110,
            render: (entry) => entry.url ? (React.createElement(Button, { label: ContentAuditContent.open, variant: "subtle", iconName: "OpenInNewWindow", href: absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href) })) : (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")),
        },
    ];
}
//# sourceMappingURL=ContentAudit.columns.js.map