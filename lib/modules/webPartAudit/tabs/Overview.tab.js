import * as React from "react";
import { WebPartAuditStats } from "../WebPartAudit.stats";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { WebPartAuditContent } from "../WebPartAudit.content";
import { InstancesByWebPartCard } from "../cards/InstancesByWebPart.ocard";
import { WebPartsBySourceCard } from "../cards/WebPartsBySource.ocard";
import { InstancesBySourceCard } from "../cards/InstancesBySource.ocard";
import { PagesByLayoutCard } from "../cards/PagesByLayout.ocard";
import { WebPartsByPageCard } from "../cards/WebPartsByPage.ocard";
export const OverviewTab = ({ view, hasData, onRun, comparison, comparisonCards, previousTiles }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: WebPartAuditContent.empty.title, description: WebPartAuditContent.empty.description, iconName: "Puzzle", actionLabel: WebPartAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        comparison,
        React.createElement(WebPartAuditStats, { view: view, previousTiles: previousTiles }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                comparisonCards,
                React.createElement(InstancesByWebPartCard, { view: view }),
                React.createElement(WebPartsBySourceCard, { view: view }),
                React.createElement(InstancesBySourceCard, { view: view }),
                React.createElement(PagesByLayoutCard, { view: view }),
                React.createElement(WebPartsByPageCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map