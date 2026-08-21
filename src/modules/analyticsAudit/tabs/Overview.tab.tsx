import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView, WindowKey } from "@/modules/analyticsAudit/AnalyticsAudit.types";
import { AnalyticsAuditStats } from "@/modules/analyticsAudit/AnalyticsAudit.stats";
import { ViewsByDayCard } from "@/modules/analyticsAudit/cards/ViewsByDay.ocard";
import { ViewersByDayCard } from "@/modules/analyticsAudit/cards/ViewersByDay.ocard";
import { ViewsByHourCard } from "@/modules/analyticsAudit/cards/ViewsByHour.ocard";
import { ViewsByWeekdayCard } from "@/modules/analyticsAudit/cards/ViewsByWeekday.ocard";
import { ViewsByFolderCard } from "@/modules/analyticsAudit/cards/ViewsByFolder.ocard";
import { ViewsByOrgUnitCard } from "@/modules/analyticsAudit/cards/ViewsByOrgUnit.ocard";
import { ViewsByFileTypeCard } from "@/modules/analyticsAudit/cards/ViewsByFileType.ocard";
import { TopPagesCard } from "@/modules/analyticsAudit/cards/TopPages.ocard";
import { TopFilesCard } from "@/modules/analyticsAudit/cards/TopFiles.ocard";
import { TimeByFolderCard } from "@/modules/analyticsAudit/cards/TimeByFolder.ocard";

export const OverviewTab: React.FC<{
  view: AnalyticsAuditView;
  window: WindowKey;
  hasData: boolean;
  sampled: boolean;
  onRun: () => void;
  comparison?: React.ReactNode;
  comparisonCards?: React.ReactNode;
  previousTiles?: StatTileSpec[];
}> = ({ view, window: activeWindow, hasData, sampled, onRun, comparison, comparisonCards, previousTiles }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={AnalyticsAuditContent.empty.title}
        description={AnalyticsAuditContent.empty.description}
        iconName="BarChartVertical"
        actionLabel={AnalyticsAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      {comparison}

      <AnalyticsAuditStats view={view} window={activeWindow} previousTiles={previousTiles} />

      <Notice tone="info" message={AnalyticsAuditContent.notes.perItem} />
      {sampled && <Notice tone="warning" message={AnalyticsAuditContent.notes.sampled} />}
      {view.viewsByHour.length === 0 && <Notice tone="info" message={AnalyticsAuditContent.notes.hourly} />}

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
          <ViewsByDayCard view={view} />
          <ViewersByDayCard view={view} />
          <ViewsByWeekdayCard view={view} />
          <ViewsByHourCard view={view} />
          <TopPagesCard view={view} />
          <ViewsByFolderCard view={view} />
          <ViewsByOrgUnitCard view={view} />
          <TimeByFolderCard view={view} />
          <TopFilesCard view={view} />
          <ViewsByFileTypeCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
