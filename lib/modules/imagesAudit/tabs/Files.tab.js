import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { ImagesAuditContent } from "../ImagesAudit.content";
import { fileColumns } from "../ImagesAudit.columns";
export const FilesTab = ({ files, emptyTitle, emptyDescription }) => {
    if (files.length === 0) {
        return (React.createElement(EmptyState, { title: emptyTitle !== null && emptyTitle !== void 0 ? emptyTitle : ImagesAuditContent.empty.title, description: emptyDescription !== null && emptyDescription !== void 0 ? emptyDescription : ImagesAuditContent.empty.description, iconName: emptyTitle ? "CheckMark" : "Photo2" }));
    }
    return (React.createElement(Table, { ariaLabel: ImagesAuditContent.tabs.files, rows: files, columns: fileColumns, getRowKey: (file) => file.url, initialSortKey: "size", initialSortDescending: true, searchValue: (file) => `${file.name} ${file.url} ${file.listTitle}`, searchLabel: ImagesAuditContent.search.files }));
};
//# sourceMappingURL=Files.tab.js.map