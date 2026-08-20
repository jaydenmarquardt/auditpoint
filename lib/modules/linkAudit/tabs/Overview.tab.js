import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { LinkAuditContent } from "../LinkAudit.content";
import { LinkAuditStats } from "../LinkAudit.stats";
import { LinksByTypeCard } from "../cards/LinksByType.ocard";
import { LinksBySourceCard } from "../cards/LinksBySource.ocard";
import { LinksByStatusCard } from "../cards/LinksByStatus.ocard";
import { BrokenByListCard } from "../cards/BrokenByList.ocard";
import { TopTargetsCard } from "../cards/TopTargets.ocard";
export const OverviewTab = ({ view, hasData, onRun, }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: LinkAuditContent.empty.title, description: LinkAuditContent.empty.description, iconName: "Link", actionLabel: LinkAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        React.createElement(LinkAuditStats, { view: view }),
        React.createElement(Notice, { tone: "info", message: LinkAuditContent.notes.external }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(LinksByTypeCard, { view: view }),
                React.createElement(LinksByStatusCard, { view: view }),
                React.createElement(LinksBySourceCard, { view: view }),
                React.createElement(TopTargetsCard, { view: view }),
                React.createElement(BrokenByListCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map