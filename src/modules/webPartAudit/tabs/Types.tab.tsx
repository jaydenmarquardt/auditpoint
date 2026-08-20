import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartTypeSummary } from "@/modules/webPartAudit/WebPartAudit.types";
import { typeColumns } from "@/modules/webPartAudit/WebPartAudit.columns";

export const TypesTab: React.FC<{
  types: WebPartTypeSummary[];
  onSelect: (type: WebPartTypeSummary) => void;
}> = ({ types, onSelect }) => {
  if (types.length === 0) {
    return (
      <EmptyState title={WebPartAuditContent.empty.title} description={WebPartAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={WebPartAuditContent.tabs.types}
      rows={types}
      columns={typeColumns}
      getRowKey={(type) => type.key}
      searchValue={(type) => `${type.name} ${type.group} ${type.webPartId} ${type.propertyKeys.join(" ")}`}
      searchLabel={WebPartAuditContent.searchTypes}
      initialSortKey="instances"
      initialSortDescending
      onRowClick={onSelect}
    />
  );
};
