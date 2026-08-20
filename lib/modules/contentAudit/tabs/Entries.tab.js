import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { ContentAuditContent } from "../ContentAudit.content";
import { entryColumns } from "../ContentAudit.columns";
export const EntriesTab = ({ entries, thinWordCount, emptyTitle, onSelect }) => {
    const columns = React.useMemo(() => entryColumns(thinWordCount), [thinWordCount]);
    if (entries.length === 0) {
        return (React.createElement(EmptyState, { title: emptyTitle !== null && emptyTitle !== void 0 ? emptyTitle : ContentAuditContent.empty.title, description: emptyTitle ? ContentAuditContent.noIssues.description : ContentAuditContent.empty.description, iconName: emptyTitle ? "CheckMark" : "TextDocument" }));
    }
    return (React.createElement(Table, { ariaLabel: ContentAuditContent.tabs.entries, rows: entries, columns: columns, getRowKey: (entry) => `${entry.siteUrl}-${entry.listTitle}-${entry.itemId}-${entry.column}`, initialSortKey: "words", initialSortDescending: true, searchValue: (entry) => `${entry.title} ${entry.url} ${entry.listTitle} ${entry.column}`, searchLabel: ContentAuditContent.search, onRowClick: onSelect }));
};
//# sourceMappingURL=Entries.tab.js.map