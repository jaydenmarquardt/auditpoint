import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
import { AnalyticsAuditStats } from "../AnalyticsAudit.stats";
import { ViewsByDayCard } from "../cards/ViewsByDay.ocard";
import { ViewersByDayCard } from "../cards/ViewersByDay.ocard";
import { ViewsByHourCard } from "../cards/ViewsByHour.ocard";
import { ViewsByWeekdayCard } from "../cards/ViewsByWeekday.ocard";
import { ViewsByFolderCard } from "../cards/ViewsByFolder.ocard";
import { ViewsByOrgUnitCard } from "../cards/ViewsByOrgUnit.ocard";
import { ViewsByFileTypeCard } from "../cards/ViewsByFileType.ocard";
import { TopPagesCard } from "../cards/TopPages.ocard";
import { TopFilesCard } from "../cards/TopFiles.ocard";
import { TimeByFolderCard } from "../cards/TimeByFolder.ocard";
export const OverviewTab = ({ view, window: activeWindow, hasData, sampled, onRun, comparison, comparisonCards, previousTiles }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: AnalyticsAuditContent.empty.title, description: AnalyticsAuditContent.empty.description, iconName: "BarChartVertical", actionLabel: AnalyticsAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        comparison,
        React.createElement(AnalyticsAuditStats, { view: view, window: activeWindow, previousTiles: previousTiles }),
        React.createElement(Notice, { tone: "info", message: AnalyticsAuditContent.notes.perItem }),
        sampled && React.createElement(Notice, { tone: "warning", message: AnalyticsAuditContent.notes.sampled }),
        view.viewsByHour.length === 0 && React.createElement(Notice, { tone: "info", message: AnalyticsAuditContent.notes.hourly }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                comparisonCards,
                React.createElement(ViewsByDayCard, { view: view }),
                React.createElement(ViewersByDayCard, { view: view }),
                React.createElement(ViewsByWeekdayCard, { view: view }),
                React.createElement(ViewsByHourCard, { view: view }),
                React.createElement(TopPagesCard, { view: view }),
                React.createElement(ViewsByFolderCard, { view: view }),
                React.createElement(ViewsByOrgUnitCard, { view: view }),
                React.createElement(TimeByFolderCard, { view: view }),
                React.createElement(TopFilesCard, { view: view }),
                React.createElement(ViewsByFileTypeCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map