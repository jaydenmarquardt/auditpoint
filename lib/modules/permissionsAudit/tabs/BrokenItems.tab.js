import * as React from "react";
import { Table } from "../../../components/data/Table";
import { Button } from "../../../components/actions/Button";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { absoluteFromServerRelative } from "../../../utils/Url.util";
const columns = [
    {
        key: "title",
        header: PermissionsAuditContent.columns.item,
        minWidth: 300,
        maxWidth: 420,
        sortValue: (item) => item.title,
        render: (item) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, item.title),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, item.url))),
    },
    {
        key: "list",
        header: PermissionsAuditContent.columns.list,
        minWidth: 220,
        sortValue: (item) => item.listTitle,
        filterValue: (item) => item.listTitle,
        render: (item) => React.createElement("span", null, item.listTitle),
    },
    {
        key: "actions",
        header: PermissionsAuditContent.columns.actions,
        minWidth: 130,
        render: (item) => item.url ? (React.createElement(Button, { label: PermissionsAuditContent.openItem, variant: "subtle", iconName: "OpenInNewWindow", href: absoluteFromServerRelative(item.url, item.siteUrl || window.location.href) })) : (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")),
    },
];
export const BrokenItemsTab = ({ items, enabled }) => {
    if (!enabled) {
        return (React.createElement(EmptyState, { title: PermissionsAuditContent.itemsOff, description: PermissionsAuditContent.itemsOffHint, iconName: "Permissions" }));
    }
    if (items.length === 0) {
        return (React.createElement(EmptyState, { title: PermissionsAuditContent.noBrokenItems, description: PermissionsAuditContent.noBrokenItemsHint, iconName: "CheckMark" }));
    }
    return (React.createElement(Table, { ariaLabel: PermissionsAuditContent.tabs.items, rows: items, columns: columns, getRowKey: (item) => `${item.siteUrl}-${item.listTitle}-${item.itemId}`, initialSortKey: "list", searchValue: (item) => `${item.title} ${item.url} ${item.listTitle}`, searchLabel: PermissionsAuditContent.search.items }));
};
//# sourceMappingURL=BrokenItems.tab.js.map