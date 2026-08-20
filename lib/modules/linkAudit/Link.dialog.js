import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Table } from "../../components/data/Table";
import { Theme } from "../../theme/Theme.api";
import { LinkAuditContent } from "./LinkAudit.content";
import { StatusTag, TypeTag, usageColumns } from "./LinkAudit.columns";
import { exportLinkUsages } from "./LinkAudit.csv";
import { formatNumber } from "../../utils/Format.util";
export const LinkDialog = ({ link, origin, onDismiss }) => {
    if (!link)
        return null;
    return (React.createElement(PreviewDialog, { open: Boolean(link), onDismiss: onDismiss, width: "full", title: link.url || link.key, description: `${LinkAuditContent.columns.uses}: ${formatNumber(link.count)}`, facts: [
            { label: LinkAuditContent.columns.type, value: React.createElement(TypeTag, { type: link.linkType }) },
            {
                label: LinkAuditContent.columns.status,
                value: React.createElement(StatusTag, { broken: link.broken, status: link.status, matched: link.targetTitle }),
            },
            { label: LinkAuditContent.columns.resolvesTo, value: link.targetTitle || "-" },
            { label: LinkAuditContent.columns.spellings, value: formatNumber(link.variants.length) },
            { label: LinkAuditContent.columns.source, value: link.sourceLists.join(", ") || "-" },
        ], actions: React.createElement(React.Fragment, null,
            link.usages.length > 0 && (React.createElement(Button, { label: LinkAuditContent.exportUsages, iconName: "ExcelDocument", onClick: () => exportLinkUsages(link, origin) })),
            link.url && link.linkType !== "anchor" && link.linkType !== "script" && (React.createElement(Button, { label: LinkAuditContent.openLink, iconName: "OpenInNewWindow", href: link.url })),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })), sections: [
            {
                key: "variants",
                title: `${LinkAuditContent.dialog.variants} (${link.variants.length})`,
                content: (React.createElement("ul", { style: { margin: 0, paddingLeft: Theme.tokens.space.lg } }, link.variants.map((variant) => (React.createElement("li", { key: variant, style: { wordBreak: "break-all" } }, variant))))),
            },
            {
                key: "usages",
                title: `${LinkAuditContent.dialog.usedIn} (${link.usages.length})`,
                content: (React.createElement(Table, { ariaLabel: LinkAuditContent.dialog.usedIn, rows: link.usages, columns: usageColumns, getRowKey: (usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`, searchValue: (usage) => `${usage.reference.title} ${usage.reference.url} ${usage.link.text}`, searchLabel: LinkAuditContent.search.broken, compact: true, maxHeight: 420 })),
            },
        ] }));
};
//# sourceMappingURL=Link.dialog.js.map