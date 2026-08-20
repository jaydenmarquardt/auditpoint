import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Button } from "../../components/actions/Button";
import { Theme } from "../../theme/Theme.api";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { daysSinceEdit, expiryDate, reviewDate, statusLabel } from "./PublishingAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
const titleColumn = {
    key: "title",
    header: PublishingAuditContent.columns.title,
    minWidth: 280,
    maxWidth: 380,
    sortValue: (item) => item.title,
    render: (item) => (React.createElement("div", { style: { minWidth: 0 } },
        React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, item.title),
        React.createElement("div", { style: {
                fontSize: Theme.tokens.font.sm,
                color: Theme.palette().textMuted,
                overflow: "hidden",
                textOverflow: "ellipsis",
            } }, item.url))),
};
const actionsColumn = {
    key: "actions",
    header: PublishingAuditContent.columns.actions,
    minWidth: 110,
    render: (item) => item.url ? (React.createElement(Button, { label: PublishingAuditContent.open, variant: "subtle", iconName: "OpenInNewWindow", href: absoluteFromServerRelative(item.url, item.siteUrl || window.location.href) })) : (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")),
};
export const itemColumns = [
    titleColumn,
    {
        key: "list",
        header: PublishingAuditContent.columns.list,
        minWidth: 180,
        sortValue: (item) => item.listTitle,
        filterValue: (item) => item.listTitle,
        render: (item) => React.createElement("span", null, item.listTitle),
    },
    {
        key: "status",
        header: PublishingAuditContent.columns.status,
        minWidth: 140,
        sortValue: (item) => statusLabel(item.moderationStatus),
        filterValue: (item) => statusLabel(item.moderationStatus),
        render: (item) => (React.createElement(Badge, { label: statusLabel(item.moderationStatus), tone: item.moderationStatus === 2 || item.moderationStatus === 3 ? "warning" : item.moderationStatus === 1 ? "danger" : "neutral", showIcon: false })),
    },
    {
        key: "editor",
        header: PublishingAuditContent.columns.editor,
        minWidth: 180,
        sortValue: (item) => item.editorTitle,
        filterValue: (item) => item.editorTitle || "-",
        render: (item) => React.createElement("span", null, item.editorTitle || "-"),
    },
    {
        key: "modified",
        header: PublishingAuditContent.columns.modified,
        minWidth: 150,
        sortValue: (item) => item.modified,
        render: (item) => React.createElement("span", null, item.modified ? formatDate(item.modified) : "-"),
    },
    {
        key: "age",
        header: PublishingAuditContent.columns.age,
        minWidth: 130,
        sortValue: (item) => daysSinceEdit(item),
        render: (item) => React.createElement("span", null, item.modified ? `${formatNumber(daysSinceEdit(item))}d` : "-"),
    },
    {
        key: "version",
        header: PublishingAuditContent.columns.version,
        minWidth: 110,
        sortValue: (item) => item.versionLabel,
        render: (item) => React.createElement("span", null, item.versionLabel || "-"),
    },
    {
        key: "versions",
        header: PublishingAuditContent.columns.versions,
        minWidth: 120,
        sortValue: (item) => { var _a; return (_a = item.versionCount) !== null && _a !== void 0 ? _a : -1; },
        render: (item) => React.createElement("span", null, item.versionCount === undefined ? "-" : formatNumber(item.versionCount)),
    },
    {
        key: "views",
        header: PublishingAuditContent.columns.views,
        minWidth: 130,
        sortValue: (item) => { var _a; return (_a = item.viewsRecent) !== null && _a !== void 0 ? _a : -1; },
        render: (item) => React.createElement("span", null, item.viewsRecent === undefined ? "-" : formatNumber(item.viewsRecent)),
    },
    actionsColumn,
];
export const reviewColumns = [
    titleColumn,
    {
        key: "list",
        header: PublishingAuditContent.columns.list,
        minWidth: 180,
        sortValue: (item) => item.listTitle,
        filterValue: (item) => item.listTitle,
        render: (item) => React.createElement("span", null, item.listTitle),
    },
    {
        key: "review",
        header: PublishingAuditContent.columns.review,
        minWidth: 160,
        sortValue: (item) => { var _a; return (_a = reviewDate(item)) !== null && _a !== void 0 ? _a : ""; },
        render: (item) => React.createElement(DateCell, { iso: reviewDate(item) }),
    },
    {
        key: "expiry",
        header: PublishingAuditContent.columns.expiry,
        minWidth: 160,
        sortValue: (item) => { var _a; return (_a = expiryDate(item)) !== null && _a !== void 0 ? _a : ""; },
        render: (item) => React.createElement(DateCell, { iso: expiryDate(item) }),
    },
    {
        key: "modified",
        header: PublishingAuditContent.columns.modified,
        minWidth: 150,
        sortValue: (item) => item.modified,
        render: (item) => React.createElement("span", null, item.modified ? formatDate(item.modified) : "-"),
    },
    actionsColumn,
];
const DateCell = ({ iso }) => {
    if (!iso)
        return React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-");
    const past = new Date(iso).getTime() < Date.now();
    return React.createElement(Badge, { label: formatDate(iso), tone: past ? "danger" : "neutral", showIcon: false });
};
//# sourceMappingURL=PublishingAudit.columns.js.map