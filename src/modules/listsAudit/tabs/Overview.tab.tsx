import * as React from "react";
import { ListsAuditStats } from "@/modules/listsAudit/ListsAudit.stats";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { ErrorBoundary } from "@/components/states/ErrorBoundary";
import { Theme } from "@/theme/Theme.api";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditConfig, ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";
import { ListsByTemplateCard } from "@/modules/listsAudit/cards/ListsByTemplate.ocard";
import { ListsByVisibilityCard } from "@/modules/listsAudit/cards/ListsByVisibility.ocard";
import { ItemsByListCard } from "@/modules/listsAudit/cards/ItemsByList.ocard";
import { StorageByListCard } from "@/modules/listsAudit/cards/StorageByList.ocard";
import { ListsByContentTypeCard } from "@/modules/listsAudit/cards/ListsByContentType.ocard";
import { FilesByTypeCard } from "@/modules/listsAudit/cards/FilesByType.ocard";
import { StorageByFileTypeCard } from "@/modules/listsAudit/cards/StorageByFileType.ocard";
import { GovernanceFlagsCard } from "@/modules/listsAudit/cards/GovernanceFlags.ocard";

export interface OverviewTabProps {
  view: ListsAuditView;
  config: ListsAuditConfig;
  hasData: boolean;
  onRun: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ view, config, hasData, onRun }) => {
  if (!hasData) {
    return (
      <EmptyState
        title={ListsAuditContent.empty.title}
        description={ListsAuditContent.empty.description}
        iconName="BulletedList"
        actionLabel={ListsAuditContent.run}
        onAction={onRun}
      />
    );
  }

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
      <ListsAuditStats view={view} config={config} />

      {!config.scanItems && <Notice tone="info" message={ListsAuditContent.scanOff} />}
      {config.scanItems && !view.storageAvailable && (
        <Notice tone="info" message={ListsAuditContent.storageUnavailable} />
      )}
      {view.truncated > 0 && <Notice tone="warning" message={`${view.truncated} ${ListsAuditContent.truncated}`} />}

      <ErrorBoundary>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
          }}
        >
          <ListsByTemplateCard view={view} />
          <ListsByVisibilityCard view={view} />
          <ItemsByListCard view={view} />
          <StorageByListCard view={view} />
          <ListsByContentTypeCard view={view} />
          <FilesByTypeCard view={view} />
          <StorageByFileTypeCard view={view} />
          <GovernanceFlagsCard view={view} />
        </div>
      </ErrorBoundary>
    </div>
  );
};
