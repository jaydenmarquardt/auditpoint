import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditConfig, PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";
import { PublishingAuditStats } from "@/modules/publishingAudit/PublishingAudit.stats";
import { ItemsCreatedByMonthCard } from "@/modules/publishingAudit/cards/ItemsCreatedByMonth.ocard";
import { ItemsModifiedByMonthCard } from "@/modules/publishingAudit/cards/ItemsModifiedByMonth.ocard";
import { EditsByWeekdayCard } from "@/modules/publishingAudit/cards/EditsByWeekday.ocard";
import { ItemsByStatusCard } from "@/modules/publishingAudit/cards/ItemsByStatus.ocard";
import { ItemsByEditorCard } from "@/modules/publishingAudit/cards/ItemsByEditor.ocard";
import { ItemsByAgeCard } from "@/modules/publishingAudit/cards/ItemsByAge.ocard";
import { ItemsByListCard } from "@/modules/publishingAudit/cards/ItemsByList.ocard";

export const OverviewTab: React.FC<{
  view: PublishingAuditView;
  config: PublishingAuditConfig;
  hasData: boolean;
  onRun: () => void;
  comparison?: React.ReactNode;
  comparisonCards?: React.ReactNode;
  previousTiles?: StatTileSpec[];
}> = ({ view, config, hasData, onRun, comparison, comparisonCards, previousTiles }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={PublishingAuditContent.empty.title}
        description={PublishingAuditContent.empty.description}
        iconName="PageEdit"
        actionLabel={PublishingAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      {comparison}

      <PublishingAuditStats view={view} config={config} previousTiles={previousTiles} />

      {config.readVersions && <Notice tone="info" message={PublishingAuditContent.versionsNote} />}

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          {comparisonCards}
          <ItemsCreatedByMonthCard view={view} />
          <ItemsModifiedByMonthCard view={view} />
          <ItemsByStatusCard view={view} />
          <ItemsByAgeCard view={view} />
          <ItemsByEditorCard view={view} />
          <EditsByWeekdayCard view={view} />
          <ItemsByListCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
