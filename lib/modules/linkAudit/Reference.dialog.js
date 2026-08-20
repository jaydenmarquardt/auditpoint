import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Table } from "../../components/data/Table";
import { Theme } from "../../theme/Theme.api";
import { LinkAuditContent } from "./LinkAudit.content";
import { flagsFor } from "./LinkAudit.logic";
import { incomingColumns, outgoingColumns } from "./LinkAudit.columns";
import { exportReferenceLinks } from "./LinkAudit.csv";
import { formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export const ReferenceDialog = ({ reference, onDismiss }) => {
    var _a, _b;
    if (!reference)
        return null;
    const outgoing = (_a = reference.outgoing) !== null && _a !== void 0 ? _a : [];
    const incoming = (_b = reference.incoming) !== null && _b !== void 0 ? _b : [];
    const broken = outgoing.filter((link) => link.broken === "yes");
    const flags = flagsFor(reference);
    return (React.createElement(PreviewDialog, { open: Boolean(reference), onDismiss: onDismiss, width: "full", title: reference.title || reference.url, description: reference.url, facts: [
            { label: LinkAuditContent.columns.kind, value: LinkAuditContent.kinds[reference.kind] },
            { label: LinkAuditContent.columns.list, value: reference.listTitle },
            { label: LinkAuditContent.columns.id, value: reference.itemId || "-" },
            { label: LinkAuditContent.columns.modified, value: reference.modified ? formatDate(reference.modified) : "-" },
            { label: LinkAuditContent.columns.outgoing, value: formatNumber(outgoing.length) },
            { label: LinkAuditContent.columns.incoming, value: formatNumber(incoming.length) },
            {
                label: LinkAuditContent.columns.flags,
                value: flags.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, flags.map((flag) => (React.createElement(Badge, { key: flag, label: flag, tone: "warning", showIcon: false }))))),
            },
        ], actions: React.createElement(React.Fragment, null,
            outgoing.length > 0 && (React.createElement(Button, { label: LinkAuditContent.exportLinks, iconName: "ExcelDocument", onClick: () => exportReferenceLinks(reference) })),
            reference.url && (React.createElement(Button, { label: LinkAuditContent.openItem, iconName: "OpenInNewWindow", href: absoluteFromServerRelative(reference.url, reference.siteUrl || window.location.href) })),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })), sections: [
            {
                key: "broken",
                title: LinkAuditContent.dialog.brokenLinks,
                content: broken.length === 0 ? (React.createElement(Badge, { label: LinkAuditContent.dialog.noBroken, tone: "success" })) : (React.createElement(Table, { ariaLabel: LinkAuditContent.dialog.brokenLinks, rows: broken, columns: outgoingColumns, getRowKey: (link) => `${link.url}-${link.source}-${link.sourceLabel}-${link.text}`, hideFilters: true, compact: true, fill: true })),
            },
            {
                key: "outgoing",
                title: LinkAuditContent.dialog.outgoing,
                content: outgoing.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, LinkAuditContent.dialog.noOutgoing)) : (React.createElement(Table, { ariaLabel: LinkAuditContent.dialog.outgoing, rows: outgoing, columns: outgoingColumns, getRowKey: (link) => `${link.url}-${link.source}-${link.sourceLabel}-${link.text}`, searchValue: (link) => `${link.url} ${link.text} ${link.sourceLabel} ${link.targetTitle}`, searchLabel: LinkAuditContent.search.links, compact: true, maxHeight: 420 })),
            },
            {
                key: "incoming",
                title: LinkAuditContent.dialog.incoming,
                content: incoming.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, LinkAuditContent.dialog.noIncoming)) : (React.createElement(Table, { ariaLabel: LinkAuditContent.dialog.incoming, rows: incoming, columns: incomingColumns, getRowKey: (summary) => `${summary.key}-${summary.source}-${summary.sourceLabel}`, searchValue: (summary) => `${summary.title} ${summary.url} ${summary.listTitle}`, searchLabel: LinkAuditContent.search.references, compact: true, maxHeight: 420 })),
            },
        ] }));
};
//# sourceMappingURL=Reference.dialog.js.map