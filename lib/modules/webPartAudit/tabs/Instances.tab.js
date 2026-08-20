import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { instanceColumns } from "../WebPartAudit.columns";
export const InstancesTab = ({ instances, onOpenPage }) => {
    const columns = React.useMemo(() => instanceColumns(onOpenPage), [onOpenPage]);
    if (instances.length === 0) {
        return (React.createElement(EmptyState, { title: WebPartAuditContent.empty.title, description: WebPartAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: WebPartAuditContent.tabs.instances, rows: instances, columns: columns, getRowKey: (instance) => `${instance.siteUrl}-${instance.pageId}-${instance.instanceId}`, searchValue: (instance) => `${instance.name} ${instance.title} ${instance.pageTitle} ${instance.pageUrl} ${instance.webPartId}`, searchLabel: WebPartAuditContent.searchInstances, onRowClick: onOpenPage, compact: true }));
};
//# sourceMappingURL=Instances.tab.js.map