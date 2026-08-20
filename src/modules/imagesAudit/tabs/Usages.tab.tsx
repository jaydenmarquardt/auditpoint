import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { ImageUsage } from "@/api/Images.types";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { usageColumns } from "@/modules/imagesAudit/ImagesAudit.columns";

export const UsagesTab: React.FC<{ usages: ImageUsage[] }> = ({ usages }) => {
  if (usages.length === 0) {
    return <EmptyState title={ImagesAuditContent.empty.title} description={ImagesAuditContent.empty.description} />;
  }

  return (
    <Table
      ariaLabel={ImagesAuditContent.tabs.usages}
      rows={usages}
      columns={usageColumns}
      getRowKey={(usage) => `${usage.pageUrl}-${usage.itemId}-${usage.src}`}
      initialSortKey="title"
      searchValue={(usage) => `${usage.title} ${usage.pageUrl} ${usage.src} ${usage.alt}`}
      searchLabel={ImagesAuditContent.search.usages}
    />
  );
};
