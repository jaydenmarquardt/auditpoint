import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Notice } from "../../../components/feedback/Notice";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { usageColumns } from "../LinkAudit.columns";
export const BrokenTab = ({ usages }) => {
    if (usages.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.tabs.broken, description: LinkAuditContent.empty.broken });
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
        React.createElement(Notice, { tone: "warning", message: LinkAuditContent.notes.broken }),
        React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.broken, rows: usages, columns: usageColumns, getRowKey: (usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`, initialSortKey: "usedIn", searchValue: (usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title} ${usage.reference.url}`, searchLabel: LinkAuditContent.search.broken })));
};
//# sourceMappingURL=Broken.tab.js.map