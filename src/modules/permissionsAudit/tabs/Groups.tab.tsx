import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { groupColumns } from "@/modules/permissionsAudit/PermissionsAudit.columns";

export const GroupsTab: React.FC<{
  groups: SiteGroupSummary[];
  onSelect: (group: SiteGroupSummary) => void;
}> = ({ groups, onSelect }) => {
  const columns = React.useMemo(() => groupColumns(onSelect), [onSelect]);

  if (groups.length === 0) {
    return (
      <EmptyState title={PermissionsAuditContent.empty.title} description={PermissionsAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={PermissionsAuditContent.tabs.groups}
      rows={groups}
      columns={columns}
      getRowKey={(group) => `${group.siteUrl}-${group.id}`}
      initialSortKey="members"
      initialSortDescending
      searchValue={(group) => `${group.title} ${group.description} ${group.ownerTitle}`}
      searchLabel={PermissionsAuditContent.search.groups}
      onRowClick={onSelect}
    />
  );
};
