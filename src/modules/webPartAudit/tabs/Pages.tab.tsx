import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartPageSummary } from "@/modules/webPartAudit/WebPartAudit.types";
import { pageColumns } from "@/modules/webPartAudit/WebPartAudit.columns";

export const PagesTab: React.FC<{
  pages: WebPartPageSummary[];
  onSelect: (page: WebPartPageSummary) => void;
}> = ({ pages, onSelect }) => {
  if (pages.length === 0) {
    return (
      <EmptyState title={WebPartAuditContent.empty.title} description={WebPartAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={WebPartAuditContent.tabs.pages}
      rows={pages}
      columns={pageColumns}
      getRowKey={(page) => `${page.siteUrl}-${page.pageId}`}
      initialSortKey="count"
      initialSortDescending
      searchValue={(page) => `${page.title} ${page.url} ${page.pageLayout}`}
      searchLabel={WebPartAuditContent.searchPages}
      onRowClick={onSelect}
    />
  );
};
