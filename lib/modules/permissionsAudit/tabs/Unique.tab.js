import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { scopeColumns } from "../PermissionsAudit.columns";
export const UniqueTab = ({ scopes }) => {
    if (scopes.length === 0) {
        return (React.createElement(EmptyState, { title: "Everything inherits", description: "No list on the scanned sites breaks permission inheritance.", iconName: "CheckMark" }));
    }
    return (React.createElement(Table, { ariaLabel: PermissionsAuditContent.tabs.unique, rows: scopes, columns: scopeColumns, getRowKey: (scope) => `${scope.siteUrl}-${scope.listId}`, initialSortKey: "items", initialSortDescending: true, searchValue: (scope) => `${scope.title} ${scope.url} ${scope.templateName}`, searchLabel: PermissionsAuditContent.search.unique }));
};
//# sourceMappingURL=Unique.tab.js.map