import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { usageColumns } from "../LinkAudit.columns";
export const MegaMenuTab = ({ usages }) => {
    if (usages.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.tabs.megaMenu, description: LinkAuditContent.empty.megaMenu });
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
        React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.megaMenu, rows: usages, columns: usageColumns, getRowKey: (usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`, initialSortKey: "foundIn", searchValue: (usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title}`, searchLabel: LinkAuditContent.search.links })));
};
//# sourceMappingURL=MegaMenu.tab.js.map