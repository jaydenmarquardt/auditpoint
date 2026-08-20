import * as React from "react";
import { StatTileSpec } from "@/components/Components.types";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { ImagesAuditView } from "@/modules/imagesAudit/ImagesAudit.types";
import { ImagesAuditStats } from "@/modules/imagesAudit/ImagesAudit.stats";
import { FilesByFormatCard } from "@/modules/imagesAudit/cards/FilesByFormat.ocard";
import { StorageByFormatCard } from "@/modules/imagesAudit/cards/StorageByFormat.ocard";
import { PlacementsByPageCard } from "@/modules/imagesAudit/cards/PlacementsByPage.ocard";
import { PlacementsByAltTextCard } from "@/modules/imagesAudit/cards/PlacementsByAltText.ocard";
import { FilesBySizeCard } from "@/modules/imagesAudit/cards/FilesBySize.ocard";
import { FilesByUseCard } from "@/modules/imagesAudit/cards/FilesByUse.ocard";

export const OverviewTab: React.FC<{ view: ImagesAuditView; hasData: boolean; onRun: () => void; comparison?: React.ReactNode; previousTiles?: StatTileSpec[] }> = ({
  view,
  hasData,
  onRun, comparison, previousTiles }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={ImagesAuditContent.empty.title}
        description={ImagesAuditContent.empty.description}
        iconName="Photo2"
        actionLabel={ImagesAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      {comparison}

      <ImagesAuditStats view={view} previousTiles={previousTiles} />

      <Notice tone="info" message={ImagesAuditContent.matchNote} />

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <FilesByFormatCard view={view} />
          <StorageByFormatCard view={view} />
          <FilesByUseCard view={view} />
          <FilesBySizeCard view={view} />
          <PlacementsByAltTextCard view={view} />
          <PlacementsByPageCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
