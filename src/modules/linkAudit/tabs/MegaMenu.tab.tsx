import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { usageColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { LinkUsage } from "@/modules/linkAudit/LinkAudit.types";

export const MegaMenuTab: React.FC<{ usages: LinkUsage[] }> = ({ usages }) => {
  if (usages.length === 0) {
    return <EmptyState title={LinkAuditContent.tabs.megaMenu} description={LinkAuditContent.empty.megaMenu} />;
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.md, minWidth: 0 }}>
      <Table
        ariaLabel={LinkAuditContent.tabs.megaMenu}
        rows={usages}
        columns={usageColumns}
        getRowKey={(usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`}
        initialSortKey="foundIn"
        searchValue={(usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title}`}
        searchLabel={LinkAuditContent.search.links}
      />
    </div>
  );
};
