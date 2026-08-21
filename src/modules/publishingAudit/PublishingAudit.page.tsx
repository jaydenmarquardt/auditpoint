import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { statTiles } from "@/modules/publishingAudit/PublishingAudit.stats";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { publishingAuditReport } from "@/modules/publishingAudit/PublishingAudit.report";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { buildView } from "@/modules/publishingAudit/PublishingAudit.logic";
import {
  PublishingAuditConfig,
  PublishingAuditData,
  PublishingPerson,
} from "@/modules/publishingAudit/PublishingAudit.types";
import { exportPublishingAudit } from "@/modules/publishingAudit/PublishingAudit.csv";
import { reviewColumns } from "@/modules/publishingAudit/PublishingAudit.columns";
import { OverviewTab } from "@/modules/publishingAudit/tabs/Overview.tab";
import { ItemsTab } from "@/modules/publishingAudit/tabs/Items.tab";
import { PeopleTab } from "@/modules/publishingAudit/People.tab";
import { PersonDialog } from "@/modules/publishingAudit/Person.dialog";
import { ItemDialog } from "@/modules/publishingAudit/Item.dialog";
import { PublishingItem } from "@/api/Publishing.types";

const PublishingAuditPage: React.FC = () => {
  const controller = useReport<PublishingAuditData, PublishingAuditConfig>(publishingAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [person, setPerson] = React.useState<PublishingPerson | undefined>(undefined);
  const [selected, setSelected] = React.useState<PublishingItem | undefined>(undefined);

  const module = findModule("publishing-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);

  const [previousData, setPreviousData] = React.useState<Partial<PublishingAuditData> | undefined>(undefined);

  // The earlier run is rebuilt through the same view, so every tile compares like for like.
  const previousTiles = React.useMemo(
    () => {
      if (!previousData) return undefined;
      const previousView = buildView(previousData, config);
      return statTiles(previousView, config);
    },
    [previousData, config]
  );

  const items = data?.items ?? [];
  const hasData = items.length > 0;

  return (
    <>
      <PageHeader
        title={PublishingAuditContent.title}
        description={PublishingAuditContent.description}
        actions={
          module ? (
            <Badge
              label={`${PublishingAuditContent.moduleVersion} ${module.version}`}
              tone="neutral"
              showIcon={false}
            />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={publishingAuditReport.kind}
          title={PublishingAuditContent.historyTitle}
          newLabel={PublishingAuditContent.run}
          busy={controller.running}
          onNew={() => setConfigOpen(true)}
          onOpen={(url) => void controller.open(url)}
          onResume={(url) => void controller.resumeSaved(url)}
          onImport={(file) => void controller.importJson(file)}
          error={controller.error}
          onDismissError={controller.clearError}
        />
      )}

      <ReportRunPanel
        title={publishingAuditReport.title}
        controller={controller}
        definition={publishingAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={PublishingAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={PublishingAuditContent.configTitle}
            definition={publishingAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: PublishingAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportPublishingAudit(data) },
              ]
            : []
        }
        runLabel={{
          run: PublishingAuditContent.run,
          rerun: PublishingAuditContent.rerun,
          pause: PublishingAuditContent.pause,
          resume: PublishingAuditContent.resume,
          cancel: PublishingAuditContent.cancel,
          configTitle: PublishingAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={PublishingAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: PublishingAuditContent.tabs.overview,
                content: (
                  <OverviewTab view={view} config={config} hasData={hasData} onRun={() => setConfigOpen(true)} previousTiles={previousTiles}
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={publishingAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<PublishingAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />
                ),
              },
              {
                key: "items",
                label: PublishingAuditContent.tabs.items,
                count: items.length,
                content: <ItemsTab items={items} onSelect={setSelected} />,
              },
              {
                key: "people",
                label: PublishingAuditContent.tabs.people,
                count: view.people.length,
                content: <PeopleTab people={view.people} onSelect={setPerson} />,
              },
              {
                key: "unpublished",
                label: PublishingAuditContent.tabs.unpublished,
                count: view.unpublishedItems.length,
                content: (
                  <ItemsTab
                    items={view.unpublishedItems}
                    emptyTitle={PublishingAuditContent.unpublishedTab}
                    emptyDescription={PublishingAuditContent.unpublishedEmpty}
                    onSelect={setSelected}
                  />
                ),
              },
              {
                key: "review",
                label: PublishingAuditContent.tabs.review,
                count: view.reviewItems.length,
                content: (
                  <ItemsTab
                    items={view.reviewItems}
                    columns={reviewColumns}
                    emptyTitle={PublishingAuditContent.noReview.title}
                    emptyDescription={PublishingAuditContent.noReview.description}
                    onSelect={setSelected}
                  />
                ),
              },
              {
                key: "stale",
                label: PublishingAuditContent.tabs.stale,
                count: view.staleItems.length,
                content: (
                  <ItemsTab
                    items={view.staleItems}
                    emptyTitle={PublishingAuditContent.noStale.title}
                    emptyDescription={PublishingAuditContent.noStale.description}
                    onSelect={setSelected}
                  />
                ),
              },
            ]}
          />
        </div>
      )}
      <PersonDialog
        person={person}
        onDismiss={() => setPerson(undefined)}
        onSelectItem={(item) => {
          setPerson(undefined);
          setSelected(item);
        }}
      />

      <ItemDialog
        item={selected}
        versionDepth={config.versionDepth}
        onLoaded={(item, count, editors) => {
          item.versionCount = count;
          item.versionEditors = editors;
          setSelected({ ...item });
        }}
        onDismiss={() => setSelected(undefined)}
      />
    </>
  );
};

export default PublishingAuditPage;
