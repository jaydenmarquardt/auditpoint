import * as React from "react";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditConfig, UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";
import { UsersAuditStats } from "@/modules/usersAudit/UsersAudit.stats";
import { UsersAddedByMonthCard } from "@/modules/usersAudit/cards/UsersAddedByMonth.ocard";
import { UsersActiveByMonthCard } from "@/modules/usersAudit/cards/UsersActiveByMonth.ocard";
import { PrincipalsByTypeCard } from "@/modules/usersAudit/cards/PrincipalsByType.ocard";
import { MembersByGroupCard } from "@/modules/usersAudit/cards/MembersByGroup.ocard";
import { PeopleByDepartmentCard } from "@/modules/usersAudit/cards/PeopleByDepartment.ocard";
import { ProfileCompletenessCard } from "@/modules/usersAudit/cards/ProfileCompleteness.ocard";

export const OverviewTab: React.FC<{
  view: UsersAuditView;
  config: UsersAuditConfig;
  hasData: boolean;
  onRun: () => void;
}> = ({ view, config, hasData, onRun }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={UsersAuditContent.empty.title}
        description={UsersAuditContent.empty.description}
        iconName="People"
        actionLabel={UsersAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <UsersAuditStats view={view} config={config} />

      <Notice tone="info" message={UsersAuditContent.activityNote} />
      {!config.readProfiles && <Notice tone="info" message={UsersAuditContent.profilesOff} />}

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <UsersAddedByMonthCard view={view} />
          <UsersActiveByMonthCard view={view} />
          <PrincipalsByTypeCard view={view} />
          <MembersByGroupCard view={view} />
          <PeopleByDepartmentCard view={view} />
          <ProfileCompletenessCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
