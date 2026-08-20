import * as React from "react";
import { Table } from "../../../components/data/Table";
import { EmptyState } from "../../../components/states/Empty.state";
import { Notice } from "../../../components/feedback/Notice";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { untestedColumns } from "../LinkAudit.columns";
export const UntestedTab = ({ usages, checked }) => {
    if (usages.length === 0) {
        return React.createElement(EmptyState, { title: LinkAuditContent.tabs.untested, description: LinkAuditContent.empty.untested });
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
        React.createElement(Notice, { tone: "info", message: LinkAuditContent.notes.broken }),
        React.createElement(Table, { ariaLabel: LinkAuditContent.tabs.untested, rows: usages, columns: untestedColumns(checked), getRowKey: (usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`, initialSortKey: "reason", searchValue: (usage) => `${usage.link.url} ${usage.link.text} ${usage.reference.title}`, searchLabel: LinkAuditContent.search.links })));
};
//# sourceMappingURL=Untested.tab.js.map