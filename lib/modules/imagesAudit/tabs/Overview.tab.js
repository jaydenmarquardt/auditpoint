import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { ImagesAuditContent } from "../ImagesAudit.content";
import { ImagesAuditStats } from "../ImagesAudit.stats";
import { FilesByFormatCard } from "../cards/FilesByFormat.ocard";
import { StorageByFormatCard } from "../cards/StorageByFormat.ocard";
import { PlacementsByPageCard } from "../cards/PlacementsByPage.ocard";
import { PlacementsByAltTextCard } from "../cards/PlacementsByAltText.ocard";
import { FilesBySizeCard } from "../cards/FilesBySize.ocard";
import { FilesByUseCard } from "../cards/FilesByUse.ocard";
export const OverviewTab = ({ view, hasData, onRun, }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: ImagesAuditContent.empty.title, description: ImagesAuditContent.empty.description, iconName: "Photo2", actionLabel: ImagesAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        React.createElement(ImagesAuditStats, { view: view }),
        React.createElement(Notice, { tone: "info", message: ImagesAuditContent.matchNote }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(FilesByFormatCard, { view: view }),
                React.createElement(StorageByFormatCard, { view: view }),
                React.createElement(FilesByUseCard, { view: view }),
                React.createElement(FilesBySizeCard, { view: view }),
                React.createElement(PlacementsByAltTextCard, { view: view }),
                React.createElement(PlacementsByPageCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map