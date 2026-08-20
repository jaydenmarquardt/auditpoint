import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { IndexingAuditContent } from "../IndexingAudit.content";
import { itemColumns } from "../IndexingAudit.columns";
export const ItemsTab = ({ rows }) => {
    if (rows.length === 0) {
        return (React.createElement(EmptyState, { title: IndexingAuditContent.itemsOff, description: IndexingAuditContent.empty.description, iconName: "Search" }));
    }
    return (React.createElement(Table, { ariaLabel: IndexingAuditContent.tabs.items, rows: rows, columns: itemColumns, getRowKey: (item) => item.url, initialSortKey: "state", searchValue: (item) => `${item.title} ${item.url} ${item.listTitle}`, searchLabel: IndexingAuditContent.searchItems }));
};
//# sourceMappingURL=Items.tab.js.map