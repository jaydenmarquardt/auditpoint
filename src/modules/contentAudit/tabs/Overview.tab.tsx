import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";
import { ContentAuditStats } from "@/modules/contentAudit/ContentAudit.stats";
import { WordsByPageCard } from "@/modules/contentAudit/cards/WordsByPage.ocard";
import { HeadingsByLevelCard } from "@/modules/contentAudit/cards/HeadingsByLevel.ocard";
import { BlocksByContentTypeCard } from "@/modules/contentAudit/cards/BlocksByContentType.ocard";
import { WordsByListCard } from "@/modules/contentAudit/cards/WordsByList.ocard";
import { BlocksBySourceCard } from "@/modules/contentAudit/cards/BlocksBySource.ocard";

export const OverviewTab: React.FC<{ view: ContentAuditView; hasData: boolean; onRun: () => void; comparison?: React.ReactNode;
  comparisonCards?: React.ReactNode; previousTiles?: StatTileSpec[] }> = ({
  view,
  hasData,
  onRun, comparison, comparisonCards, previousTiles }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={ContentAuditContent.empty.title}
        description={ContentAuditContent.empty.description}
        iconName="TextDocument"
        actionLabel={ContentAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      {comparison}

      <ContentAuditStats view={view} previousTiles={previousTiles} />

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
          <WordsByPageCard view={view} />
          <HeadingsByLevelCard view={view} />
          <BlocksByContentTypeCard view={view} />
          <WordsByListCard view={view} />
          <BlocksBySourceCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
