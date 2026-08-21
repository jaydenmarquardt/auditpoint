import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { entryColumns } from "@/modules/analyticsAudit/AnalyticsAudit.columns";
import { AnalyticsEntry, WindowKey } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const EntriesTab: React.FC<{
  entries: AnalyticsEntry[];
  window: WindowKey;
  emptyTitle?: string;
  emptyDescription?: string;
}> = ({ entries, window: activeWindow, emptyTitle, emptyDescription }) => {
  if (entries.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? AnalyticsAuditContent.empty.title}
        description={emptyDescription ?? AnalyticsAuditContent.empty.entries}
      />
    );
  }

  return (
    <Table
      ariaLabel={AnalyticsAuditContent.title}
      rows={entries}
      columns={entryColumns(activeWindow)}
      getRowKey={(entry) => `${entry.listTitle}-${entry.itemId}`}
      initialSortKey="views"
      initialSortDescending
      searchValue={(entry) => `${entry.title} ${entry.url} ${entry.folder} ${entry.orgUnit}`}
      searchLabel={AnalyticsAuditContent.title}
    />
  );
};
