import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { groupColumns } from "../PermissionsAudit.columns";
export const GroupsTab = ({ groups, onSelect }) => {
    const columns = React.useMemo(() => groupColumns(onSelect), [onSelect]);
    if (groups.length === 0) {
        return (React.createElement(EmptyState, { title: PermissionsAuditContent.empty.title, description: PermissionsAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: PermissionsAuditContent.tabs.groups, rows: groups, columns: columns, getRowKey: (group) => `${group.siteUrl}-${group.id}`, initialSortKey: "members", initialSortDescending: true, searchValue: (group) => `${group.title} ${group.description} ${group.ownerTitle}`, searchLabel: PermissionsAuditContent.search.groups, onRowClick: onSelect }));
};
//# sourceMappingURL=Groups.tab.js.map