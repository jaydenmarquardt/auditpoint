import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { WebPartInstance } from "@/api/WebParts.types";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { instanceColumns } from "@/modules/webPartAudit/WebPartAudit.columns";

export const InstancesTab: React.FC<{
  instances: WebPartInstance[];
  onOpenPage: (instance: WebPartInstance) => void;
}> = ({ instances, onOpenPage }) => {
  const columns = React.useMemo(() => instanceColumns(onOpenPage), [onOpenPage]);

  if (instances.length === 0) {
    return (
      <EmptyState title={WebPartAuditContent.empty.title} description={WebPartAuditContent.empty.description} />
    );
  }

  return (
    <Table
      ariaLabel={WebPartAuditContent.tabs.instances}
      rows={instances}
      columns={columns}
      getRowKey={(instance) => `${instance.siteUrl}-${instance.pageId}-${instance.instanceId}`}
      searchValue={(instance) =>
        `${instance.name} ${instance.title} ${instance.pageTitle} ${instance.pageUrl} ${instance.webPartId}`
      }
      searchLabel={WebPartAuditContent.searchInstances}
      onRowClick={onOpenPage}
      compact
    />
  );
};
