import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { pageColumns } from "../WebPartAudit.columns";
export const PagesTab = ({ pages, onSelect }) => {
    if (pages.length === 0) {
        return (React.createElement(EmptyState, { title: WebPartAuditContent.empty.title, description: WebPartAuditContent.empty.description }));
    }
    return (React.createElement(Table, { ariaLabel: WebPartAuditContent.tabs.pages, rows: pages, columns: pageColumns, getRowKey: (page) => `${page.siteUrl}-${page.pageId}`, initialSortKey: "count", initialSortDescending: true, searchValue: (page) => `${page.title} ${page.url} ${page.pageLayout}`, searchLabel: WebPartAuditContent.searchPages, onRowClick: onSelect }));
};
//# sourceMappingURL=Pages.tab.js.map