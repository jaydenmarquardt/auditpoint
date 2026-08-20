import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { SiteList } from "@/api/Lists.types";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";

export interface AllListsTabProps {
  rows: SiteList[];
  columns: TableColumn<SiteList>[];
  onSelect: (list: SiteList) => void;
}

export const AllListsTab: React.FC<AllListsTabProps> = ({ rows, columns, onSelect }) => {
  if (rows.length === 0) {
    return <EmptyState title={ListsAuditContent.empty.title} description={ListsAuditContent.empty.description} />;
  }

  return (
    <Table
      ariaLabel={ListsAuditContent.title}
      rows={rows}
      columns={columns}
      getRowKey={(list) => `${list.siteUrl ?? ""}-${list.id}`}
      initialSortKey="items"
      initialSortDescending
      searchValue={(list) => `${list.title} ${list.templateName} ${list.serverRelativeUrl}`}
      searchLabel={ListsAuditContent.searchLists}
      onRowClick={onSelect}
    />
  );
};
