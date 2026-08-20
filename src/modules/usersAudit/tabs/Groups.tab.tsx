import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { groupColumns, groupSettingsUrl } from "@/modules/usersAudit/UsersAudit.columns";

export const GroupsTab: React.FC<{ groups: SiteGroupSummary[] }> = ({ groups }) => {
  if (groups.length === 0) {
    return <EmptyState title={UsersAuditContent.empty.title} description={UsersAuditContent.empty.description} />;
  }

  return (
    <Table
      ariaLabel={UsersAuditContent.tabs.groups}
      rows={groups}
      columns={groupColumns}
      getRowKey={(group) => `${group.siteUrl}-${group.id}`}
      initialSortKey="members"
      initialSortDescending
      searchValue={(group) => `${group.title} ${group.description} ${group.ownerTitle}`}
      searchLabel={UsersAuditContent.search.groups}
      onRowClick={(group) => window.open(groupSettingsUrl(group), "_blank", "noopener")}
    />
  );
};
