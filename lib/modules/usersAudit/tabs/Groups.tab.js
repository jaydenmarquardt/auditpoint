import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { UsersAuditContent } from "../UsersAudit.content";
import { groupColumns, groupSettingsUrl } from "../UsersAudit.columns";
export const GroupsTab = ({ groups }) => {
    if (groups.length === 0) {
        return React.createElement(EmptyState, { title: UsersAuditContent.empty.title, description: UsersAuditContent.empty.description });
    }
    return (React.createElement(Table, { ariaLabel: UsersAuditContent.tabs.groups, rows: groups, columns: groupColumns, getRowKey: (group) => `${group.siteUrl}-${group.id}`, initialSortKey: "members", initialSortDescending: true, searchValue: (group) => `${group.title} ${group.description} ${group.ownerTitle}`, searchLabel: UsersAuditContent.search.groups, onRowClick: (group) => window.open(groupSettingsUrl(group), "_blank", "noopener") }));
};
//# sourceMappingURL=Groups.tab.js.map