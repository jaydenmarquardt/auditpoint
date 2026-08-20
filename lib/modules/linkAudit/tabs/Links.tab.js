import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { LinkAuditContent } from "../LinkAudit.content";
import { linkColumns } from "../LinkAudit.columns";
export const LinksTab = ({ links, onSelect }) => {
    if (links.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.empty.title, description: LinkAuditContent.empty.links });
    }
    return (React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.links, rows: links, columns: linkColumns, getRowKey: (link) => link.key, onRowClick: onSelect, initialSortKey: "uses", initialSortDescending: true, searchValue: (link) => `${link.key} ${link.text} ${link.targetTitle} ${link.variants.join(" ")}`, searchLabel: LinkAuditContent.search.links }));
};
//# sourceMappingURL=Links.tab.js.map