import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
import { entryColumns } from "../AnalyticsAudit.columns";
export const EntriesTab = ({ entries, window: activeWindow, emptyTitle, emptyDescription }) => {
    if (entries.length === 0) {
        return (React.createElement(EmptyState, { title: emptyTitle !== null && emptyTitle !== void 0 ? emptyTitle : AnalyticsAuditContent.empty.title, description: emptyDescription !== null && emptyDescription !== void 0 ? emptyDescription : AnalyticsAuditContent.empty.entries }));
    }
    return (React.createElement(Table, { ariaLabel: AnalyticsAuditContent.title, rows: entries, columns: entryColumns(activeWindow), getRowKey: (entry) => `${entry.listTitle}-${entry.itemId}`, initialSortKey: "views", initialSortDescending: true, searchValue: (entry) => `${entry.title} ${entry.url} ${entry.folder} ${entry.orgUnit}`, searchLabel: AnalyticsAuditContent.title }));
};
//# sourceMappingURL=Entries.tab.js.map