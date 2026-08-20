import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Notice } from "../../../components/feedback/Notice";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { usageColumns } from "../LinkAudit.columns";
export const ExternalTab = ({ usages }) => {
    if (usages.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.tabs.external, description: LinkAuditContent.empty.external });
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
        React.createElement(Notice, { tone: "info", message: LinkAuditContent.notes.external }),
        React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.external, rows: usages, columns: usageColumns, getRowKey: (usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`, initialSortKey: "link", searchValue: (usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title}`, searchLabel: LinkAuditContent.search.links })));
};
//# sourceMappingURL=External.tab.js.map