import * as React from "react";
import { Table } from "../../../components/data/Table";
import { Picker } from "../../../components/inputs/Picker";
import { EmptyState } from "../../../components/states/Empty.state";
import { UsersAuditContent } from "../UsersAudit.content";
import { userColumns } from "../UsersAudit.columns";
import { groupsByLogin } from "../UsersAudit.logic";
export const UsersTab = ({ users, groups, recentDays, onSelect }) => {
    const [group, setGroup] = React.useState(undefined);
    const membership = React.useMemo(() => groupsByLogin(groups), [groups]);
    const columns = React.useMemo(() => userColumns(recentDays, (user) => { var _a; return (_a = membership.get(user.loginName.toLowerCase())) !== null && _a !== void 0 ? _a : []; }), [recentDays, membership]);
    const rows = group
        ? users.filter((user) => { var _a; return ((_a = membership.get(user.loginName.toLowerCase())) !== null && _a !== void 0 ? _a : []).indexOf(group) !== -1; })
        : users;
    if (users.length === 0) {
        return React.createElement(EmptyState, { title: UsersAuditContent.empty.title, description: UsersAuditContent.empty.description });
    }
    return (React.createElement(Table, { ariaLabel: UsersAuditContent.tabs.users, rows: rows, columns: columns, getRowKey: (user) => `${user.siteUrl}-${user.id}`, initialSortKey: "created", initialSortDescending: true, searchValue: (user) => `${user.title} ${user.loginName} ${user.email}`, searchLabel: UsersAuditContent.search.users, onRowClick: onSelect, extraFilters: groups.length > 0 ? (React.createElement("div", { style: { minWidth: 240 } },
            React.createElement(Picker, { label: UsersAuditContent.columns.group, options: groups.map((entry) => ({ key: entry.title, text: `${entry.title} (${entry.memberCount})` })), selectedKey: group, onChange: (value) => setGroup(value || undefined), placeholder: UsersAuditContent.allGroups }))) : undefined }));
};
//# sourceMappingURL=Users.tab.js.map