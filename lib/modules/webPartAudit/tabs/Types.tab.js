import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { typeColumns } from "../WebPartAudit.columns";
export const TypesTab = ({ types, onSelect }) => {
    if (types.length === 0) {
        return (React.createElement(EmptyState, { title: WebPartAuditContent.empty.title, description: WebPartAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: WebPartAuditContent.tabs.types, rows: types, columns: typeColumns, getRowKey: (type) => type.key, searchValue: (type) => `${type.name} ${type.group} ${type.webPartId} ${type.propertyKeys.join(" ")}`, searchLabel: WebPartAuditContent.searchTypes, initialSortKey: "instances", initialSortDescending: true, onRowClick: onSelect }));
};
//# sourceMappingURL=Types.tab.js.map