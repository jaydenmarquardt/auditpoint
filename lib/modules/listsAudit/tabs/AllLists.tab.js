import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { ListsAuditContent } from "../ListsAudit.content";
export const AllListsTab = ({ rows, columns, onSelect }) => {
    if (rows.length === 0) {
        return React.createElement(EmptyState, { title: ListsAuditContent.empty.title, description: ListsAuditContent.empty.description });
    }
    return (React.createElement(Table, { ariaLabel: ListsAuditContent.title, rows: rows, columns: columns, getRowKey: (list) => { var _a; return `${(_a = list.siteUrl) !== null && _a !== void 0 ? _a : ""}-${list.id}`; }, initialSortKey: "items", initialSortDescending: true, searchValue: (list) => `${list.title} ${list.templateName} ${list.serverRelativeUrl}`, searchLabel: ListsAuditContent.searchLists, onRowClick: onSelect }));
};
//# sourceMappingURL=AllLists.tab.js.map