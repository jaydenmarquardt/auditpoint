import * as React from "react";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { PermissionsAuditConfig, PermissionsAuditView } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { PermissionsAuditStats } from "@/modules/permissionsAudit/PermissionsAudit.stats";
import { GrantsByPrincipalTypeCard } from "@/modules/permissionsAudit/cards/GrantsByPrincipalType.ocard";
import { GrantsByLevelCard } from "@/modules/permissionsAudit/cards/GrantsByLevel.ocard";
import { MembersByGroupCard } from "@/modules/permissionsAudit/cards/MembersByGroup.ocard";
import { ListsByInheritanceCard } from "@/modules/permissionsAudit/cards/ListsByInheritance.ocard";

export const OverviewTab: React.FC<{
  view: PermissionsAuditView;
  config: PermissionsAuditConfig;
  hasData: boolean;
  onRun: () => void;
}> = ({ view, config, hasData, onRun }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={PermissionsAuditContent.empty.title}
        description={PermissionsAuditContent.empty.description}
        iconName="Permissions"
        actionLabel={PermissionsAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <PermissionsAuditStats view={view} config={config} />

      {view.totals.directUserGrants > 0 && <Notice tone="warning" message={PermissionsAuditContent.directNotice} />}
      {view.totals.everyoneGrants > 0 && <Notice tone="warning" message={PermissionsAuditContent.everyoneNotice} />}
      {!config.checkItemBreaks && <Notice tone="info" message={PermissionsAuditContent.itemsOff} />}

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <GrantsByPrincipalTypeCard view={view} />
          <GrantsByLevelCard view={view} />
          <MembersByGroupCard view={view} />
          <ListsByInheritanceCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
