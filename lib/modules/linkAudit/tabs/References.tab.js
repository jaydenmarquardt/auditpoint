import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { LinkAuditContent } from "../LinkAudit.content";
import { referenceColumns } from "../LinkAudit.columns";
export const ReferencesTab = ({ references, onSelect }) => {
    if (references.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.empty.title, description: LinkAuditContent.empty.references });
    }
    return (React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.references, rows: references, columns: referenceColumns, getRowKey: (reference) => reference.key, onRowClick: onSelect, initialSortKey: "broken", initialSortDescending: true, searchValue: (reference) => {
            var _a, _b;
            return `${reference.title} ${reference.url} ${reference.listTitle} ${((_a = reference.outgoing) !== null && _a !== void 0 ? _a : [])
                .map((link) => link.url)
                .join(" ")} ${((_b = reference.incoming) !== null && _b !== void 0 ? _b : []).map((summary) => summary.url).join(" ")}`;
        }, searchLabel: LinkAuditContent.search.references }));
};
//# sourceMappingURL=References.tab.js.map