import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Spinner } from "../../components/feedback/Spinner";
import { Theme } from "../../theme/Theme.api";
import { Publishing } from "../../api/Publishing.api";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { daysSinceEdit, expiryDate, reviewDate, statusLabel, } from "./PublishingAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
import { toErrorMessage } from "../../utils/Guard.util";
export const ItemDialog = ({ item, versionDepth, onLoaded, onDismiss }) => {
    var _a;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(undefined);
    const loadVersions = () => {
        if (!item)
            return;
        setLoading(true);
        setError(undefined);
        Publishing(item.siteUrl)
            .versions({ id: item.listId, title: item.listTitle }, item.itemId, versionDepth)
            .then((history) => onLoaded(item, history.count, history.editors))
            .catch((thrown) => setError(toErrorMessage(thrown)))
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };
    if (!item)
        return null;
    return (React.createElement(PreviewDialog, { open: Boolean(item), onDismiss: onDismiss, title: item.title, description: item.url, facts: [
            { label: PublishingAuditContent.columns.list, value: item.listTitle },
            {
                label: PublishingAuditContent.columns.status,
                value: React.createElement(Badge, { label: statusLabel(item.moderationStatus), tone: "neutral", showIcon: false }),
            },
            { label: PublishingAuditContent.columns.author, value: item.authorTitle || "-" },
            { label: PublishingAuditContent.columns.created, value: item.created ? formatDate(item.created) : "-" },
            { label: PublishingAuditContent.columns.editor, value: item.editorTitle || "-" },
            { label: PublishingAuditContent.columns.modified, value: item.modified ? formatDate(item.modified) : "-" },
            { label: PublishingAuditContent.columns.age, value: `${formatNumber(daysSinceEdit(item))}d` },
            { label: PublishingAuditContent.columns.version, value: item.versionLabel || "-" },
            { label: PublishingAuditContent.columns.review, value: reviewDate(item) ? formatDate(reviewDate(item)) : "-" },
            { label: PublishingAuditContent.columns.expiry, value: expiryDate(item) ? formatDate(expiryDate(item)) : "-" },
            {
                label: PublishingAuditContent.columns.views,
                value: item.viewsRecent === undefined ? "-" : formatNumber(item.viewsRecent),
            },
        ], actions: React.createElement(React.Fragment, null,
            item.url && (React.createElement(Button, { label: PublishingAuditContent.open, iconName: "OpenInNewWindow", href: absoluteFromServerRelative(item.url, item.siteUrl || window.location.href) })),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })), sections: [
            {
                key: "dates",
                title: PublishingAuditContent.dialog.dates,
                content: Object.keys(item.dates).length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, PublishingAuditContent.dialog.noDates)) : (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" } }, Object.entries(item.dates).map(([column, value]) => (React.createElement(Badge, { key: column, label: `${column}: ${formatDate(value)}`, tone: "neutral", showIcon: false }))))),
            },
            {
                key: "versions",
                title: PublishingAuditContent.dialog.versions,
                content: loading ? (React.createElement(Spinner, { label: PublishingAuditContent.dialog.versions })) : (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.sm } },
                    error && React.createElement("p", { style: { margin: 0, color: Theme.tone("danger").fg } }, error),
                    item.versionCount === undefined ? (React.createElement("div", null,
                        React.createElement(Button, { label: PublishingAuditContent.dialog.loadVersions, iconName: "History", onClick: loadVersions }))) : (React.createElement(React.Fragment, null,
                        React.createElement("p", { style: { margin: 0 } },
                            formatNumber(item.versionCount),
                            " ",
                            PublishingAuditContent.dialog.versionsRead),
                        React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" } }, ((_a = item.versionEditors) !== null && _a !== void 0 ? _a : []).map((editor) => (React.createElement(Badge, { key: editor, label: editor, tone: "info", showIcon: false })))))))),
            },
        ] }));
};
//# sourceMappingURL=Item.dialog.js.map