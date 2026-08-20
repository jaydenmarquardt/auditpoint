import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { ListIndexCoverage } from "@/api/Indexing.types";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { listColumns } from "@/modules/indexingAudit/IndexingAudit.columns";

export const ListsTab: React.FC<{ rows: ListIndexCoverage[]; target: number }> = ({ rows, target }) => {
  const columns = React.useMemo(() => listColumns(target), [target]);

  if (rows.length === 0) {
    return (
      <EmptyState title={IndexingAuditContent.empty.title} description={IndexingAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={IndexingAuditContent.tabs.lists}
      rows={rows}
      columns={columns}
      getRowKey={(list) => `${list.siteUrl}-${list.listId}`}
      initialSortKey="coverage"
      searchValue={(list) => `${list.title} ${list.url} ${list.templateName}`}
      searchLabel={IndexingAuditContent.search}
    />
  );
};
