import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { PublishingItem } from "@/api/Publishing.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { itemColumns } from "@/modules/publishingAudit/PublishingAudit.columns";

export const ItemsTab: React.FC<{
  items: PublishingItem[];
  columns?: TableColumn<PublishingItem>[];
  emptyTitle?: string;
  emptyDescription?: string;
  onSelect: (item: PublishingItem) => void;
}> = ({ items, columns = itemColumns, emptyTitle, emptyDescription, onSelect }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? PublishingAuditContent.empty.title}
        description={emptyDescription ?? PublishingAuditContent.empty.description}
        iconName={emptyTitle ? "CheckMark" : "PublishContent"}
      />
    );
  }

  return (
    <Table
      ariaLabel={PublishingAuditContent.tabs.items}
      rows={items}
      columns={columns}
      getRowKey={(item) => `${item.siteUrl}-${item.listId}-${item.itemId}`}
      initialSortKey="modified"
      initialSortDescending
      searchValue={(item) => `${item.title} ${item.url} ${item.listTitle} ${item.editorTitle}`}
      searchLabel={PublishingAuditContent.search}
      onRowClick={onSelect}
    />
  );
};
