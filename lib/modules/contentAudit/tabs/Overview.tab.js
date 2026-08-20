import * as React from "react";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { ContentAuditContent } from "../ContentAudit.content";
import { ContentAuditStats } from "../ContentAudit.stats";
import { WordsByPageCard } from "../cards/WordsByPage.ocard";
import { HeadingsByLevelCard } from "../cards/HeadingsByLevel.ocard";
import { BlocksByContentTypeCard } from "../cards/BlocksByContentType.ocard";
import { WordsByListCard } from "../cards/WordsByList.ocard";
import { BlocksBySourceCard } from "../cards/BlocksBySource.ocard";
export const OverviewTab = ({ view, hasData, onRun, comparison, previousTiles }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: ContentAuditContent.empty.title, description: ContentAuditContent.empty.description, iconName: "TextDocument", actionLabel: ContentAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        comparison,
        React.createElement(ContentAuditStats, { view: view, previousTiles: previousTiles }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(WordsByPageCard, { view: view }),
                React.createElement(HeadingsByLevelCard, { view: view }),
                React.createElement(BlocksByContentTypeCard, { view: view }),
                React.createElement(WordsByListCard, { view: view }),
                React.createElement(BlocksBySourceCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map