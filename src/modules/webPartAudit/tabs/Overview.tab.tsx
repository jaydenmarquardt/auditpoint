import * as React from "react";
import { WebPartAuditStats } from "@/modules/webPartAudit/WebPartAudit.stats";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";
import { InstancesByWebPartCard } from "@/modules/webPartAudit/cards/InstancesByWebPart.ocard";
import { WebPartsBySourceCard } from "@/modules/webPartAudit/cards/WebPartsBySource.ocard";
import { InstancesBySourceCard } from "@/modules/webPartAudit/cards/InstancesBySource.ocard";
import { PagesByLayoutCard } from "@/modules/webPartAudit/cards/PagesByLayout.ocard";
import { WebPartsByPageCard } from "@/modules/webPartAudit/cards/WebPartsByPage.ocard";

export interface OverviewTabProps {
  view: WebPartAuditView;
  hasData: boolean;
  onRun: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ view, hasData, onRun }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={WebPartAuditContent.empty.title}
        description={WebPartAuditContent.empty.description}
        iconName="Puzzle"
        actionLabel={WebPartAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <WebPartAuditStats view={view} />

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <InstancesByWebPartCard view={view} />
          <WebPartsBySourceCard view={view} />
          <InstancesBySourceCard view={view} />
          <PagesByLayoutCard view={view} />
          <WebPartsByPageCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
