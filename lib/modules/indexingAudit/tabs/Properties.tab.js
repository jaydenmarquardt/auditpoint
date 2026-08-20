import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { IndexingAuditContent } from "../IndexingAudit.content";
const columns = [
    {
        key: "name",
        header: IndexingAuditContent.columns.property,
        minWidth: 320,
        sortValue: (row) => row.name,
        render: (row) => React.createElement("code", { style: { fontSize: Theme.tokens.font.sm } }, row.name),
    },
];
export const PropertiesTab = ({ properties }) => {
    if (properties.length === 0) {
        return (React.createElement(EmptyState, { title: IndexingAuditContent.empty.title, description: "Managed property listing was off for this run, or search returned no rows to read them from.", iconName: "Tag" }));
    }
    return (React.createElement(Table, { ariaLabel: IndexingAuditContent.tabs.properties, rows: properties.map((name) => ({ name })), columns: columns, getRowKey: (row) => row.name, initialSortKey: "name", searchValue: (row) => row.name, searchLabel: IndexingAuditContent.searchProperties }));
};
//# sourceMappingURL=Properties.tab.js.map