import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { StatGrid } from "../../components/layout/StatGrid";
import { Theme } from "../../theme/Theme.api";
import { ContentAuditContent } from "./ContentAudit.content";
import { issuesFor } from "./ContentAudit.logic";
import { formatDate, formatDuration, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export const ContentDialog = ({ entry, thinWordCount, onDismiss }) => {
    var _a;
    if (!entry)
        return null;
    const issues = issuesFor(entry, thinWordCount);
    const headings = Object.entries((_a = entry.headingsByLevel) !== null && _a !== void 0 ? _a : {}).filter(([, count]) => count > 0);
    return (React.createElement(PreviewDialog, { open: Boolean(entry), onDismiss: onDismiss, title: entry.title || entry.url, description: entry.url, facts: [
            { label: ContentAuditContent.columns.source, value: ContentAuditContent.sources[entry.source] },
            { label: ContentAuditContent.columns.list, value: entry.listTitle },
            { label: ContentAuditContent.columns.column, value: React.createElement("code", null, entry.column) },
            { label: "Content type", value: entry.contentType || "-" },
            { label: ContentAuditContent.columns.modified, value: entry.modified ? formatDate(entry.modified) : "-" },
            {
                label: ContentAuditContent.columns.issues,
                value: issues.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, issues.map((issue) => (React.createElement(Badge, { key: issue, label: issue, tone: "warning", showIcon: false }))))),
            },
        ], actions: React.createElement(React.Fragment, null,
            entry.url && (React.createElement(Button, { label: ContentAuditContent.open, iconName: "OpenInNewWindow", href: absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href) })),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })), sections: [
            {
                key: "metrics",
                title: ContentAuditContent.dialog.metrics,
                content: (React.createElement(StatGrid, { columns: 4, tiles: [
                        { key: "words", label: ContentAuditContent.columns.words, value: formatNumber(entry.words) },
                        { key: "characters", label: "Characters", value: formatNumber(entry.characters) },
                        { key: "paragraphs", label: "Paragraphs", value: formatNumber(entry.paragraphs) },
                        {
                            key: "reading",
                            label: ContentAuditContent.columns.reading,
                            value: formatDuration(entry.readingMinutes * 60 * 1000),
                        },
                        { key: "headings", label: ContentAuditContent.columns.headings, value: formatNumber(entry.headings) },
                        { key: "images", label: ContentAuditContent.columns.images, value: formatNumber(entry.images) },
                        { key: "links", label: ContentAuditContent.columns.links, value: formatNumber(entry.links) },
                        { key: "external", label: "External links", value: formatNumber(entry.externalLinks) },
                        { key: "empty", label: "Empty links", value: formatNumber(entry.emptyLinks) },
                        { key: "tables", label: ContentAuditContent.columns.tables, value: formatNumber(entry.tables) },
                        { key: "lists", label: "List blocks", value: formatNumber(entry.listBlocks) },
                        { key: "embeds", label: "Embeds", value: formatNumber(entry.embeds) },
                    ] })),
            },
            {
                key: "headings",
                title: ContentAuditContent.dialog.headings,
                content: headings.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, ContentAuditContent.dialog.noHeadings)) : (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" } }, headings.map(([level, count]) => (React.createElement(Badge, { key: level, label: `${level.toUpperCase()}: ${count}`, tone: "info", showIcon: false }))))),
            },
        ] }));
};
//# sourceMappingURL=Content.dialog.js.map