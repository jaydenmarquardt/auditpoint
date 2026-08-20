import * as React from "react";
import { Table } from "@/components/data/Table";
import { Picker } from "@/components/inputs/Picker";
import { EmptyState } from "@/components/states/Empty.state";
import { SiteUser } from "@/api/Users.types";
import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { userColumns } from "@/modules/usersAudit/UsersAudit.columns";
import { groupsByLogin } from "@/modules/usersAudit/UsersAudit.logic";

export interface UsersTabProps {
  users: SiteUser[];
  groups: SiteGroupSummary[];
  recentDays: number;
  onSelect: (user: SiteUser) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, groups, recentDays, onSelect }) => {
  const [group, setGroup] = React.useState<string | undefined>(undefined);
  const membership = React.useMemo(() => groupsByLogin(groups), [groups]);
  const columns = React.useMemo(
    () => userColumns(recentDays, (user) => membership.get(user.loginName.toLowerCase()) ?? []),
    [recentDays, membership]
  );

  const rows = group
    ? users.filter((user) => (membership.get(user.loginName.toLowerCase()) ?? []).indexOf(group) !== -1)
    : users;

  if (users.length === 0) {
    return <EmptyState title={UsersAuditContent.empty.title} description={UsersAuditContent.empty.description} />;
  }

  return (
    <Table
        ariaLabel={UsersAuditContent.tabs.users}
        rows={rows}
        columns={columns}
        getRowKey={(user) => `${user.siteUrl}-${user.id}`}
        initialSortKey="created"
        initialSortDescending
        searchValue={(user) => `${user.title} ${user.loginName} ${user.email}`}
      searchLabel={UsersAuditContent.search.users}
      onRowClick={onSelect}
      extraFilters={
        groups.length > 0 ? (
          <div style={{ minWidth: 240 }}>
            <Picker
              label={UsersAuditContent.columns.group}
              options={groups.map((entry) => ({ key: entry.title, text: `${entry.title} (${entry.memberCount})` }))}
              selectedKey={group}
              onChange={(value) => setGroup(value || undefined)}
              placeholder={UsersAuditContent.allGroups}
            />
          </div>
        ) : undefined
      }
    />
  );
};
