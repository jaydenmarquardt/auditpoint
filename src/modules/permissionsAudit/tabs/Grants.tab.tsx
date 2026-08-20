import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { PermissionGrant } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { grantColumns } from "@/modules/permissionsAudit/PermissionsAudit.columns";

export const GrantsTab: React.FC<{ grants: PermissionGrant[] }> = ({ grants }) => {
  if (grants.length === 0) {
    return (
      <EmptyState title={PermissionsAuditContent.empty.title} description={PermissionsAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={PermissionsAuditContent.tabs.grants}
      rows={grants}
      columns={grantColumns}
      getRowKey={(grant) => `${grant.scope}-${grant.scopeUrl}-${grant.principalId}`}
      initialSortKey="principal"
      searchValue={(grant) =>
        `${grant.principalTitle} ${grant.loginName} ${grant.scopeTitle} ${grant.roles.join(" ")}`
      }
      searchLabel={PermissionsAuditContent.search.grants}
    />
  );
};
