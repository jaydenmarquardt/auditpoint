import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { ItemIndexCheck } from "@/api/Indexing.types";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { itemColumns } from "@/modules/indexingAudit/IndexingAudit.columns";

export const ItemsTab: React.FC<{ rows: ItemIndexCheck[] }> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={IndexingAuditContent.itemsOff}
        description={IndexingAuditContent.empty.description}
        iconName="Search"
      />
    );
  }

  return (
    <Table
      ariaLabel={IndexingAuditContent.tabs.items}
      rows={rows}
      columns={itemColumns}
      getRowKey={(item) => item.url}
      initialSortKey="state"
      searchValue={(item) => `${item.title} ${item.url} ${item.listTitle}`}
      searchLabel={IndexingAuditContent.searchItems}
    />
  );
};
