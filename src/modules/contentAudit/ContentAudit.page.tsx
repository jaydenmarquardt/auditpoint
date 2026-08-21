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
import { statTiles } from "@/modules/contentAudit/ContentAudit.stats";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { ComparisonCards } from "@/modules/shared/ComparisonCards";
import { compareTiles } from "@/modules/shared/StatSections";
import { contentAuditReport } from "@/modules/contentAudit/ContentAudit.report";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { buildView } from "@/modules/contentAudit/ContentAudit.logic";
import { ContentAuditConfig, ContentAuditData } from "@/modules/contentAudit/ContentAudit.types";
import { exportContentAudit } from "@/modules/contentAudit/ContentAudit.csv";
import { OverviewTab } from "@/modules/contentAudit/tabs/Overview.tab";
import { EntriesTab } from "@/modules/contentAudit/tabs/Entries.tab";
import { ContentDialog } from "@/modules/contentAudit/Content.dialog";
import { ContentEntry } from "@/modules/contentAudit/ContentAudit.types";

const ContentAuditPage: React.FC = () => {
  const controller = useReport<ContentAuditData, ContentAuditConfig>(contentAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ContentEntry | undefined>(undefined);

  const module = findModule("content-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);

  const [previousData, setPreviousData] = React.useState<Partial<ContentAuditData> | undefined>(undefined);

  // The earlier run is rebuilt through the same view, so every tile compares like for like.
  const previousTiles = React.useMemo(
    () => {
      if (!previousData) return undefined;
      const previousView = buildView(previousData, config);
      return statTiles(previousView);
    },
    [previousData, config]
  );

  const entries = data?.entries ?? [];
  const hasData = entries.length > 0;

  return (
    <>
      <PageHeader
        title={ContentAuditContent.title}
        description={ContentAuditContent.description}
        actions={
          module ? (
            <Badge label={`${ContentAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={contentAuditReport.kind}
          title={ContentAuditContent.historyTitle}
          newLabel={ContentAuditContent.run}
          busy={controller.running || controller.loading}
          onNew={() => setConfigOpen(true)}
          onOpen={(url) => void controller.open(url)}
          onResume={(url) => void controller.resumeSaved(url)}
          onImport={(file) => void controller.importJson(file)}
          error={controller.error}
          onDismissError={controller.clearError}
        />
      )}

      <ReportRunPanel
        title={contentAuditReport.title}
        controller={controller}
        definition={contentAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={ContentAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={ContentAuditContent.configTitle}
            definition={contentAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: ContentAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportContentAudit(data) },
              ]
            : []
        }
        runLabel={{
          run: ContentAuditContent.run,
          rerun: ContentAuditContent.rerun,
          pause: ContentAuditContent.pause,
          resume: ContentAuditContent.resume,
          cancel: ContentAuditContent.cancel,
          configTitle: ContentAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={ContentAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: ContentAuditContent.tabs.overview,
                content: <OverviewTab view={view} hasData={hasData} onRun={() => setConfigOpen(true)} previousTiles={previousTiles}
                    comparisonCards={
                      previousTiles ? (
                        <ComparisonCards sections={[{ title: "", tiles: compareTiles(statTiles(view), previousTiles) }]} />
                      ) : undefined
                    }
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={contentAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<ContentAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />,
              },
              {
                key: "entries",
                label: ContentAuditContent.tabs.entries,
                count: entries.length,
                content: (
                  <EntriesTab entries={entries} thinWordCount={config.thinWordCount} onSelect={setSelected} />
                ),
              },
              {
                key: "issues",
                label: ContentAuditContent.tabs.issues,
                count: view.issues.length,
                content: (
                  <EntriesTab
                    entries={view.issues}
                    thinWordCount={config.thinWordCount}
                    emptyTitle={ContentAuditContent.noIssues.title}
                    onSelect={setSelected}
                  />
                ),
              },
            ]}
          />
        </div>
      )}
      <ContentDialog
        entry={selected}
        thinWordCount={config.thinWordCount}
        onDismiss={() => setSelected(undefined)}
      />
    </>
  );
};

export default ContentAuditPage;
