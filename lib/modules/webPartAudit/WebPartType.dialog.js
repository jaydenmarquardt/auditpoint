import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Table } from "../../components/data/Table";
import { Theme } from "../../theme/Theme.api";
import { propertyUsage } from "./WebPartAudit.logic";
import { WebPartAuditContent } from "./WebPartAudit.content";
import { formatNumber } from "../../utils/Format.util";
import { exportTypeInstances } from "./WebPartAudit.csv";
export const WebPartTypeDialog = ({ type, instances, onDismiss, onOpenPage, }) => {
    if (!type)
        return null;
    const mine = instances.filter((instance) => (instance.webPartId || instance.name) === type.key);
    const usage = propertyUsage(mine);
    const usageColumns = [
        {
            key: "key",
            header: WebPartAuditContent.dialog.property,
            minWidth: 200,
            sortValue: (row) => row.key,
            render: (row) => React.createElement("code", { style: { fontSize: Theme.tokens.font.sm } }, row.key),
        },
        {
            key: "present",
            header: WebPartAuditContent.dialog.usedOn,
            minWidth: 160,
            sortValue: (row) => row.present,
            render: (row) => (React.createElement("span", null,
                formatNumber(row.present),
                " of ",
                formatNumber(mine.length),
                " (",
                row.percent,
                "%)")),
        },
        {
            key: "values",
            header: WebPartAuditContent.dialog.commonValues,
            minWidth: 320,
            maxWidth: 520,
            render: (row) => (React.createElement("span", { style: { color: Theme.palette().textMuted } }, row.topValues.map((value) => `${value.value} (${value.count})`).join(", ") || WebPartAuditContent.none)),
        },
    ];
    const pageColumns = [
        {
            key: "page",
            header: WebPartAuditContent.columns.page,
            minWidth: 280,
            sortValue: (instance) => instance.pageTitle,
            render: (instance) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600 } }, instance.pageTitle),
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, instance.pageUrl))),
        },
        {
            key: "title",
            header: WebPartAuditContent.columns.title,
            minWidth: 180,
            sortValue: (instance) => instance.title,
            render: (instance) => React.createElement("span", null, instance.title || WebPartAuditContent.none),
        },
        {
            key: "section",
            header: WebPartAuditContent.columns.section,
            minWidth: 130,
            sortValue: (instance) => instance.section * 100 + instance.column,
            render: (instance) => (React.createElement("span", null, instance.layer === 1 ? WebPartAuditContent.titleArea : `${instance.section + 1}.${instance.column + 1}`)),
        },
        {
            key: "open",
            header: WebPartAuditContent.columns.actions,
            minWidth: 130,
            render: (instance) => (React.createElement(Button, { label: WebPartAuditContent.dialog.openPage, variant: "subtle", iconName: "Page", onClick: () => {
                    onDismiss();
                    onOpenPage(instance);
                } })),
        },
    ];
    return (React.createElement(PreviewDialog, { open: Boolean(type), onDismiss: onDismiss, title: type.name, description: type.description || undefined, facts: [
            { label: WebPartAuditContent.columns.instances, value: formatNumber(type.instances) },
            { label: WebPartAuditContent.columns.pages, value: formatNumber(type.pages) },
            { label: WebPartAuditContent.columns.group, value: type.group || WebPartAuditContent.none },
            {
                label: WebPartAuditContent.columns.catalogue,
                value: (React.createElement(Badge, { label: type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue, tone: type.inCatalogue ? "success" : "warning" })),
            },
            { label: WebPartAuditContent.columns.id, value: React.createElement("code", null, type.webPartId || WebPartAuditContent.none) },
            {
                label: WebPartAuditContent.dialog.commonProperties,
                value: type.commonPropertyKeys.join(", ") || WebPartAuditContent.none,
            },
        ], actions: React.createElement(React.Fragment, null,
            React.createElement(Button, { label: WebPartAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportTypeInstances(type.name, mine) }),
            React.createElement(Button, { label: WebPartAuditContent.dialog.close, variant: "primary", onClick: onDismiss })), sections: [
            {
                key: "usage",
                title: WebPartAuditContent.dialog.propertyUsage,
                content: (React.createElement(Table, { ariaLabel: WebPartAuditContent.dialog.propertyUsage, rows: usage, columns: usageColumns, getRowKey: (row) => row.key, initialSortKey: "present", initialSortDescending: true, maxHeight: 320 })),
            },
            {
                key: "shared",
                title: WebPartAuditContent.dialog.sharedValues,
                content: type.sharedValues.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, WebPartAuditContent.dialog.noShared)) : (React.createElement("ul", { style: { margin: 0, paddingLeft: Theme.tokens.space.lg } }, type.sharedValues.map((entry) => (React.createElement("li", { key: entry.key },
                    React.createElement("code", null, entry.key),
                    ": ",
                    entry.value))))),
            },
            {
                key: "pages",
                title: WebPartAuditContent.dialog.whereUsed,
                content: (React.createElement(Table, { ariaLabel: WebPartAuditContent.dialog.whereUsed, rows: mine, columns: pageColumns, getRowKey: (instance) => `${instance.pageId}-${instance.instanceId}`, searchValue: (instance) => `${instance.pageTitle} ${instance.pageUrl} ${instance.title}`, searchLabel: WebPartAuditContent.searchInstances, maxHeight: 380 })),
            },
        ] }));
};
//# sourceMappingURL=WebPartType.dialog.js.map