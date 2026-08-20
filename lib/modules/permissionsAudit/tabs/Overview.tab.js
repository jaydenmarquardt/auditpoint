import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { PermissionsAuditContent } from "../PermissionsAudit.content";
import { PermissionsAuditStats } from "../PermissionsAudit.stats";
import { GrantsByPrincipalTypeCard } from "../cards/GrantsByPrincipalType.ocard";
import { GrantsByLevelCard } from "../cards/GrantsByLevel.ocard";
import { MembersByGroupCard } from "../cards/MembersByGroup.ocard";
import { ListsByInheritanceCard } from "../cards/ListsByInheritance.ocard";
export const OverviewTab = ({ view, config, hasData, onRun }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: PermissionsAuditContent.empty.title, description: PermissionsAuditContent.empty.description, iconName: "Permissions", actionLabel: PermissionsAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        React.createElement(PermissionsAuditStats, { view: view, config: config }),
        view.totals.directUserGrants > 0 && React.createElement(Notice, { tone: "warning", message: PermissionsAuditContent.directNotice }),
        view.totals.everyoneGrants > 0 && React.createElement(Notice, { tone: "warning", message: PermissionsAuditContent.everyoneNotice }),
        !config.checkItemBreaks && React.createElement(Notice, { tone: "info", message: PermissionsAuditContent.itemsOff }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(GrantsByPrincipalTypeCard, { view: view }),
                React.createElement(GrantsByLevelCard, { view: view }),
                React.createElement(MembersByGroupCard, { view: view }),
                React.createElement(ListsByInheritanceCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map