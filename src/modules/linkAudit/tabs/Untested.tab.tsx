import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { Notice } from "@/components/feedback/Notice";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { untestedColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { LinkUsage } from "@/modules/linkAudit/LinkAudit.types";

export const UntestedTab: React.FC<{ usages: LinkUsage[]; checked: boolean }> = ({ usages, checked }) => {
  if (usages.length === 0) {
    return <EmptyState title={LinkAuditContent.tabs.untested} description={LinkAuditContent.empty.untested} />;
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.md, minWidth: 0 }}>
      <Notice tone="info" message={LinkAuditContent.notes.broken} />

      <Table
        ariaLabel={LinkAuditContent.tabs.untested}
        rows={usages}
        columns={untestedColumns(checked)}
        getRowKey={(usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`}
        initialSortKey="reason"
        searchValue={(usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title}`}
        searchLabel={LinkAuditContent.search.links}
      />
    </div>
  );
};
