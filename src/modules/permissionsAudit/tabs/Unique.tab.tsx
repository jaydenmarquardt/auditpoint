import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { UniqueScope } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { scopeColumns } from "@/modules/permissionsAudit/PermissionsAudit.columns";

export const UniqueTab: React.FC<{ scopes: UniqueScope[] }> = ({ scopes }) => {
  if (scopes.length === 0) {
    return (
      <EmptyState
        title="Everything inherits"
        description="No list on the scanned sites breaks permission inheritance."
        iconName="CheckMark"
      />
    );
  }

  return (
    <Table
      ariaLabel={PermissionsAuditContent.tabs.unique}
      rows={scopes}
      columns={scopeColumns}
      getRowKey={(scope) => `${scope.siteUrl}-${scope.listId}`}
      initialSortKey="items"
      initialSortDescending
      searchValue={(scope) => `${scope.title} ${scope.url} ${scope.templateName}`}
      searchLabel={PermissionsAuditContent.search.unique}
    />
  );
};
