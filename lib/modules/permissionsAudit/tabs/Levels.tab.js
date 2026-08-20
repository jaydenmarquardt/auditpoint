import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { levelColumns } from "../PermissionsAudit.columns";
export const LevelsTab = ({ levels, onSelect }) => {
    if (levels.length === 0) {
        return (React.createElement(EmptyState, { title: PermissionsAuditContent.empty.title, description: PermissionsAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: PermissionsAuditContent.tabs.levels, rows: levels, columns: levelColumns, getRowKey: (level) => String(level.id), initialSortKey: "name", searchValue: (level) => `${level.name} ${level.description}`, searchLabel: PermissionsAuditContent.search.levels, onRowClick: onSelect }));
};
//# sourceMappingURL=Levels.tab.js.map