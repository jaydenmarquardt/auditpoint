import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { PermissionLevel } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { levelColumns } from "@/modules/permissionsAudit/PermissionsAudit.columns";

export const LevelsTab: React.FC<{
  levels: PermissionLevel[];
  onSelect: (level: PermissionLevel) => void;
}> = ({ levels, onSelect }) => {
  if (levels.length === 0) {
    return (
      <EmptyState title={PermissionsAuditContent.empty.title} description={PermissionsAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={PermissionsAuditContent.tabs.levels}
      rows={levels}
      columns={levelColumns}
      getRowKey={(level) => String(level.id)}
      initialSortKey="name"
      searchValue={(level) => `${level.name} ${level.description}`}
      searchLabel={PermissionsAuditContent.search.levels}
      onRowClick={onSelect}
    />
  );
};
