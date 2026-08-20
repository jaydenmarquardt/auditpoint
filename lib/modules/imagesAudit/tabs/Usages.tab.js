import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { ImagesAuditContent } from "../ImagesAudit.content";
import { usageColumns } from "../ImagesAudit.columns";
export const UsagesTab = ({ usages }) => {
    if (usages.length === 0) {
        return React.createElement(EmptyState, { title: ImagesAuditContent.empty.title, description: ImagesAuditContent.empty.description });
    }
    return (React.createElement(Table, { ariaLabel: ImagesAuditContent.tabs.usages, rows: usages, columns: usageColumns, getRowKey: (usage) => `${usage.pageUrl}-${usage.itemId}-${usage.src}`, initialSortKey: "title", searchValue: (usage) => `${usage.title} ${usage.pageUrl} ${usage.src} ${usage.alt}`, searchLabel: ImagesAuditContent.search.usages }));
};
//# sourceMappingURL=Usages.tab.js.map