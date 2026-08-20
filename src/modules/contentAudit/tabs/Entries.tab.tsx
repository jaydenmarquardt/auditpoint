import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentEntry } from "@/modules/contentAudit/ContentAudit.types";
import { entryColumns } from "@/modules/contentAudit/ContentAudit.columns";

export const EntriesTab: React.FC<{
  entries: ContentEntry[];
  thinWordCount: number;
  emptyTitle?: string;
  onSelect: (entry: ContentEntry) => void;
}> = ({ entries, thinWordCount, emptyTitle, onSelect }) => {
  const columns = React.useMemo(() => entryColumns(thinWordCount), [thinWordCount]);

  if (entries.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? ContentAuditContent.empty.title}
        description={
          emptyTitle ? ContentAuditContent.noIssues.description : ContentAuditContent.empty.description
        }
        iconName={emptyTitle ? "CheckMark" : "TextDocument"}
      />
    );
  }

  return (
    <Table
      ariaLabel={ContentAuditContent.tabs.entries}
      rows={entries}
      columns={columns}
      getRowKey={(entry) => `${entry.siteUrl}-${entry.listTitle}-${entry.itemId}-${entry.column}`}
      initialSortKey="words"
      initialSortDescending
      searchValue={(entry) => `${entry.title} ${entry.url} ${entry.listTitle} ${entry.column}`}
      searchLabel={ContentAuditContent.search}
      onRowClick={onSelect}
    />
  );
};
