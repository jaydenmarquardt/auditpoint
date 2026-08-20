import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { linkColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { AggregatedLink } from "@/modules/linkAudit/LinkAudit.types";

export const LinksTab: React.FC<{
  links: AggregatedLink[];
  onSelect: (link: AggregatedLink) => void;
}> = ({ links, onSelect }) => {
  if (links.length === 0) {
    return <EmptyState title={LinkAuditContent.empty.title} description={LinkAuditContent.empty.links} />;
  }

  return (
    <Table
      ariaLabel={LinkAuditContent.tabs.links}
      rows={links}
      columns={linkColumns}
      getRowKey={(link) => link.key}
      onRowClick={onSelect}
      initialSortKey="uses"
      initialSortDescending
      searchValue={(link) => `${link.key} ${link.text} ${link.targetTitle} ${link.variants.join(" ")}`}
      searchLabel={LinkAuditContent.search.links}
    />
  );
};
