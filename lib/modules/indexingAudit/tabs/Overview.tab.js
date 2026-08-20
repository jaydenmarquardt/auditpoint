import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { IndexingAuditContent } from "../IndexingAudit.content";
import { IndexingAuditStats } from "../IndexingAudit.stats";
import { CoverageByListCard } from "../cards/CoverageByList.ocard";
import { IndexedByListCard } from "../cards/IndexedByList.ocard";
import { ListsByCrawlSettingCard } from "../cards/ListsByCrawlSetting.ocard";
import { ItemsByIndexStateCard } from "../cards/ItemsByIndexState.ocard";
export const OverviewTab = ({ view, config, hasData, onRun }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: IndexingAuditContent.empty.title, description: IndexingAuditContent.empty.description, iconName: "Search", actionLabel: IndexingAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        React.createElement(IndexingAuditStats, { view: view, config: config }),
        view.totals.sitesExcluded > 0 && React.createElement(Notice, { tone: "error", message: IndexingAuditContent.siteExcluded }),
        config.checkCoverage && React.createElement(Notice, { tone: "info", message: IndexingAuditContent.coverageHint }),
        !config.checkItems && React.createElement(Notice, { tone: "info", message: IndexingAuditContent.itemsOff }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(CoverageByListCard, { view: view }),
                React.createElement(ListsByCrawlSettingCard, { view: view }),
                React.createElement(IndexedByListCard, { view: view }),
                React.createElement(ItemsByIndexStateCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map