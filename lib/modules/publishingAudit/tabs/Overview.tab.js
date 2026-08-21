import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { PublishingAuditContent } from "../PublishingAudit.content";
import { PublishingAuditStats } from "../PublishingAudit.stats";
import { ItemsCreatedByMonthCard } from "../cards/ItemsCreatedByMonth.ocard";
import { ItemsModifiedByMonthCard } from "../cards/ItemsModifiedByMonth.ocard";
import { EditsByWeekdayCard } from "../cards/EditsByWeekday.ocard";
import { ItemsByStatusCard } from "../cards/ItemsByStatus.ocard";
import { ItemsByEditorCard } from "../cards/ItemsByEditor.ocard";
import { ItemsByAgeCard } from "../cards/ItemsByAge.ocard";
import { ItemsByListCard } from "../cards/ItemsByList.ocard";
export const OverviewTab = ({ view, config, hasData, onRun, comparison, comparisonCards, previousTiles }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: PublishingAuditContent.empty.title, description: PublishingAuditContent.empty.description, iconName: "PageEdit", actionLabel: PublishingAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        comparison,
        React.createElement(PublishingAuditStats, { view: view, config: config, previousTiles: previousTiles }),
        config.readVersions && React.createElement(Notice, { tone: "info", message: PublishingAuditContent.versionsNote }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                comparisonCards,
                React.createElement(ItemsCreatedByMonthCard, { view: view }),
                React.createElement(ItemsModifiedByMonthCard, { view: view }),
                React.createElement(ItemsByStatusCard, { view: view }),
                React.createElement(ItemsByAgeCard, { view: view }),
                React.createElement(ItemsByEditorCard, { view: view }),
                React.createElement(EditsByWeekdayCard, { view: view }),
                React.createElement(ItemsByListCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map