import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { WebPartAuditContent } from "../WebPartAudit.content";
const columns = [
    {
        key: "title",
        header: WebPartAuditContent.columns.name,
        minWidth: 280,
        sortValue: (entry) => entry.title,
        render: (entry) => (React.createElement("span", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm } },
            React.createElement("i", { className: `ms-Icon ms-Icon--${entry.iconName || "Puzzle"}`, "aria-hidden": "true" }),
            entry.title)),
    },
    {
        key: "group",
        header: WebPartAuditContent.columns.group,
        minWidth: 180,
        sortValue: (entry) => entry.group,
        filterValue: (entry) => entry.group || WebPartAuditContent.none,
        render: (entry) => React.createElement("span", null, entry.group || WebPartAuditContent.none),
    },
    {
        key: "id",
        header: WebPartAuditContent.columns.id,
        minWidth: 320,
        sortValue: (entry) => entry.id,
        render: (entry) => React.createElement("code", { style: { fontSize: Theme.tokens.font.sm } }, entry.id),
    },
];
export const CatalogueTab = ({ rows }) => {
    if (rows.length === 0) {
        return (React.createElement(EmptyState, { title: WebPartAuditContent.catalogueEmpty.title, description: WebPartAuditContent.catalogueEmpty.description, iconName: "CheckMark" }));
    }
    return (React.createElement(Table, { ariaLabel: WebPartAuditContent.tabs.catalogue, rows: rows, columns: columns, getRowKey: (entry) => entry.id, searchValue: (entry) => `${entry.title} ${entry.group} ${entry.id}`, searchLabel: WebPartAuditContent.searchTypes }));
};
//# sourceMappingURL=Catalogue.tab.js.map