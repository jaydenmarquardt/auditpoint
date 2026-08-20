import * as React from "react";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditConfig, IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";
import { IndexingAuditStats } from "@/modules/indexingAudit/IndexingAudit.stats";
import { CoverageByListCard } from "@/modules/indexingAudit/cards/CoverageByList.ocard";
import { IndexedByListCard } from "@/modules/indexingAudit/cards/IndexedByList.ocard";
import { ListsByCrawlSettingCard } from "@/modules/indexingAudit/cards/ListsByCrawlSetting.ocard";
import { ItemsByIndexStateCard } from "@/modules/indexingAudit/cards/ItemsByIndexState.ocard";

export interface OverviewTabProps {
  view: IndexingAuditView;
  config: IndexingAuditConfig;
  hasData: boolean;
  onRun: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ view, config, hasData, onRun }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={IndexingAuditContent.empty.title}
        description={IndexingAuditContent.empty.description}
        iconName="Search"
        actionLabel={IndexingAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <IndexingAuditStats view={view} config={config} />

      {view.totals.sitesExcluded > 0 && <Notice tone="error" message={IndexingAuditContent.siteExcluded} />}
      {config.checkCoverage && <Notice tone="info" message={IndexingAuditContent.coverageHint} />}
      {!config.checkItems && <Notice tone="info" message={IndexingAuditContent.itemsOff} />}

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <CoverageByListCard view={view} />
          <ListsByCrawlSettingCard view={view} />
          <IndexedByListCard view={view} />
          <ItemsByIndexStateCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
