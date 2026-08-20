import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { IndexingAuditContent } from "../IndexingAudit.content";
import { listColumns } from "../IndexingAudit.columns";
export const ListsTab = ({ rows, target }) => {
    const columns = React.useMemo(() => listColumns(target), [target]);
    if (rows.length === 0) {
        return (React.createElement(EmptyState, { title: IndexingAuditContent.empty.title, description: IndexingAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: IndexingAuditContent.tabs.lists, rows: rows, columns: columns, getRowKey: (list) => `${list.siteUrl}-${list.listId}`, initialSortKey: "coverage", searchValue: (list) => `${list.title} ${list.url} ${list.templateName}`, searchLabel: IndexingAuditContent.search }));
};
//# sourceMappingURL=Lists.tab.js.map