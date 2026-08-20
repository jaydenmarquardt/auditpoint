import * as React from "react";
import { StatTile } from "@/components/layout/StatTile";
import { Theme } from "@/theme/Theme.api";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { IndexingAuditConfig, IndexingAuditView } from "@/modules/indexingAudit/IndexingAudit.types";
import { formatNumber } from "@/utils/Format.util";

export interface IndexingStatsProps {
  view: IndexingAuditView;
  config: IndexingAuditConfig;
}

export const IndexingAuditStats: React.FC<IndexingStatsProps> = ({ view, config }) => {
  const { totals } = view;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: Theme.tokens.space.md,
        width: "100%",
        minWidth: 0,
      }}
    >
      <StatTile
        iconName="BulletedList"
        label={IndexingAuditContent.stats.lists}
        value={formatNumber(totals.lists)}
        info={IndexingAuditContent.tileInfo.lists}
      />
      <StatTile
        iconName="Blocked"
        label={IndexingAuditContent.stats.excluded}
        value={formatNumber(totals.excluded)}
        tone="warning"
        badge={totals.excluded > 0 ? IndexingAuditContent.review : undefined}
        info={IndexingAuditContent.tileInfo.excluded}
      />
      <StatTile
        iconName="PieSingle"
        label={IndexingAuditContent.stats.coverage}
        value={config.checkCoverage ? `${totals.coveragePercent}%` : "-"}
        info={IndexingAuditContent.tileInfo.coverage}
      />
      <StatTile
        iconName="SearchAndApps"
        label={IndexingAuditContent.stats.indexed}
        value={formatNumber(totals.indexedItems)}
        unavailable={!(config.checkCoverage)}
        info={IndexingAuditContent.tileInfo.indexed}
      />
      <StatTile
        iconName="CheckList"
        label={IndexingAuditContent.stats.expected}
        value={formatNumber(totals.expectedItems)}
        info={IndexingAuditContent.tileInfo.expected}
      />
      <StatTile
        iconName="Down"
        label={IndexingAuditContent.stats.below}
        value={formatNumber(totals.listsBelowTarget)}
        unavailable={!(config.checkCoverage)}
        tone="warning"
        info={IndexingAuditContent.tileInfo.below}
      />
      <StatTile
        iconName="Warning"
        label={IndexingAuditContent.stats.missing}
        value={formatNumber(totals.itemsMissing)}
        unavailable={!(config.checkItems)}
        tone="warning"
        badge={totals.itemsMissing > 0 ? IndexingAuditContent.review : undefined}
        info={IndexingAuditContent.tileInfo.missing}
      />
      <StatTile
        iconName="Clock"
        label={IndexingAuditContent.stats.stale}
        value={formatNumber(totals.itemsStale)}
        unavailable={!(config.checkItems)}
        info={IndexingAuditContent.tileInfo.stale}
      />
      <StatTile
        iconName="Tag"
        label={IndexingAuditContent.stats.properties}
        value={formatNumber(totals.managedProperties)}
        info={IndexingAuditContent.tileInfo.properties}
      />
    </div>
  );
};
