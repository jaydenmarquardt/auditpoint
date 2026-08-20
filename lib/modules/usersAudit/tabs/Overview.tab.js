import * as React from "react";
import { Notice } from "../../../components/feedback/Notice";
import { EmptyState } from "../../../components/states/Empty.state";
import { ErrorBoundary } from "../../../components/states/ErrorBoundary";
import { Theme } from "../../../theme/Theme.api";
import { UsersAuditContent } from "../UsersAudit.content";
import { UsersAuditStats } from "../UsersAudit.stats";
import { UsersAddedByMonthCard } from "../cards/UsersAddedByMonth.ocard";
import { UsersActiveByMonthCard } from "../cards/UsersActiveByMonth.ocard";
import { PrincipalsByTypeCard } from "../cards/PrincipalsByType.ocard";
import { MembersByGroupCard } from "../cards/MembersByGroup.ocard";
import { PeopleByDepartmentCard } from "../cards/PeopleByDepartment.ocard";
import { ProfileCompletenessCard } from "../cards/ProfileCompleteness.ocard";
export const OverviewTab = ({ view, config, hasData, onRun }) => {
    if (!hasData) {
        return (React.createElement(EmptyState, { title: UsersAuditContent.empty.title, description: UsersAuditContent.empty.description, iconName: "People", actionLabel: UsersAuditContent.run, onAction: onRun }));
    }
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
        React.createElement(UsersAuditStats, { view: view, config: config }),
        React.createElement(Notice, { tone: "info", message: UsersAuditContent.activityNote }),
        !config.readProfiles && React.createElement(Notice, { tone: "info", message: UsersAuditContent.profilesOff }),
        React.createElement(ErrorBoundary, null,
            React.createElement("div", { style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                    minWidth: 0,
                } },
                React.createElement(UsersAddedByMonthCard, { view: view }),
                React.createElement(UsersActiveByMonthCard, { view: view }),
                React.createElement(PrincipalsByTypeCard, { view: view }),
                React.createElement(MembersByGroupCard, { view: view }),
                React.createElement(PeopleByDepartmentCard, { view: view }),
                React.createElement(ProfileCompletenessCard, { view: view })))));
};
//# sourceMappingURL=Overview.tab.js.map