import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { referenceColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { Reference } from "@/modules/linkAudit/LinkAudit.types";

export const ReferencesTab: React.FC<{
  references: Reference[];
  onSelect: (reference: Reference) => void;
}> = ({ references, onSelect }) => {
  if (references.length === 0) {
    return <EmptyState title={LinkAuditContent.empty.title} description={LinkAuditContent.empty.references} />;
  }

  return (
    <Table
      ariaLabel={LinkAuditContent.tabs.references}
      rows={references}
      columns={referenceColumns}
      getRowKey={(reference) => reference.key}
      onRowClick={onSelect}
      initialSortKey="broken"
      initialSortDescending
      searchValue={(reference) =>
        `${reference.title} ${reference.url} ${reference.listTitle} ${(reference.outgoing ?? [])
          .map((link) => link.url)
          .join(" ")} ${(reference.incoming ?? []).map((summary) => summary.url).join(" ")}`
      }
      searchLabel={LinkAuditContent.search.references}
    />
  );
};
