import * as React from "react";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";
import { LinkAuditStats } from "@/modules/linkAudit/LinkAudit.stats";
import { LinksByTypeCard } from "@/modules/linkAudit/cards/LinksByType.ocard";
import { LinksBySourceCard } from "@/modules/linkAudit/cards/LinksBySource.ocard";
import { LinksByStatusCard } from "@/modules/linkAudit/cards/LinksByStatus.ocard";
import { BrokenByListCard } from "@/modules/linkAudit/cards/BrokenByList.ocard";
import { TopTargetsCard } from "@/modules/linkAudit/cards/TopTargets.ocard";

export const OverviewTab: React.FC<{ view: LinkAuditView; hasData: boolean; onRun: () => void }> = ({
  view,
  hasData,
  onRun,
}) => {
  if (!hasData) {
    return (
      <EmptyState
        title={LinkAuditContent.empty.title}
        description={LinkAuditContent.empty.description}
        iconName="Link"
        actionLabel={LinkAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <LinkAuditStats view={view} />

      <Notice tone="info" message={LinkAuditContent.notes.external} />

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <LinksByTypeCard view={view} />
          <LinksByStatusCard view={view} />
          <LinksBySourceCard view={view} />
          <TopTargetsCard view={view} />
          <BrokenByListCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
