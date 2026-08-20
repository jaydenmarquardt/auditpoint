import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { PublishingAuditContent } from "../PublishingAudit.content";
import { itemColumns } from "../PublishingAudit.columns";
export const ItemsTab = ({ items, columns = itemColumns, emptyTitle, emptyDescription, onSelect }) => {
    if (items.length === 0) {
        return (React.createElement(EmptyState, { title: emptyTitle !== null && emptyTitle !== void 0 ? emptyTitle : PublishingAuditContent.empty.title, description: emptyDescription !== null && emptyDescription !== void 0 ? emptyDescription : PublishingAuditContent.empty.description, iconName: emptyTitle ? "CheckMark" : "PublishContent" }));
    }
    return (React.createElement(Table, { ariaLabel: PublishingAuditContent.tabs.items, rows: items, columns: columns, getRowKey: (item) => `${item.siteUrl}-${item.listId}-${item.itemId}`, initialSortKey: "modified", initialSortDescending: true, searchValue: (item) => `${item.title} ${item.url} ${item.listTitle} ${item.editorTitle}`, searchLabel: PublishingAuditContent.search, onRowClick: onSelect }));
};
//# sourceMappingURL=Items.tab.js.map