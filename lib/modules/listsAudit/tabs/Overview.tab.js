import * as React from "react";
import { ListsAuditStats } from "../ListsAudit.stats";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { ListsAuditContent } from "../ListsAudit.content";
import { ListsByTemplateCard } from "../cards/ListsByTemplate.ocard";
import { ListsByVisibilityCard } from "../cards/ListsByVisibility.ocard";
import { ItemsByListCard } from "../cards/ItemsByList.ocard";
import { StorageByListCard } from "../cards/StorageByList.ocard";
import { ListsByContentTypeCard } from "../cards/ListsByContentType.ocard";
import { FilesByTypeCard } from "../cards/FilesByType.ocard";
import { StorageByFileTypeCard } from "../cards/StorageByFileType.ocard";
import { GovernanceFlagsCard } from "../cards/GovernanceFlags.ocard";
export const OverviewTab = ({ view, config, hasData, onRun, comparison, comparisonCards, previousTiles }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: ListsAuditContent.empty.title, description: ListsAuditContent.empty.description, iconName: "BulletedList", actionLabel: ListsAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        comparison,
        React.createElement(ListsAuditStats, { view: view, config: config, previousTiles: previousTiles }),
        !config.scanItems && React.createElement(Notice, { tone: "info", message: ListsAuditContent.scanOff }),
        config.scanItems && !view.storageAvailable && (React.createElement(Notice, { tone: "info", message: ListsAuditContent.storageUnavailable })),
        view.truncated > 0 && React.createElement(Notice, { tone: "warning", message: `${view.truncated} ${ListsAuditContent.truncated}` }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                comparisonCards,
                React.createElement(ListsByTemplateCard, { view: view }),
                React.createElement(ListsByVisibilityCard, { view: view }),
                React.createElement(ItemsByListCard, { view: view }),
                React.createElement(StorageByListCard, { view: view }),
                React.createElement(ListsByContentTypeCard, { view: view }),
                React.createElement(FilesByTypeCard, { view: view }),
                React.createElement(StorageByFileTypeCard, { view: view }),
                React.createElement(GovernanceFlagsCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map