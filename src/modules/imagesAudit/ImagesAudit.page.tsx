import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportSkeleton } from "@/modules/shared/ReportSkeleton";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { statTiles } from "@/modules/imagesAudit/ImagesAudit.stats";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { ComparisonCards } from "@/modules/shared/ComparisonCards";
import { compareTiles } from "@/modules/shared/StatSections";
import { imagesAuditReport } from "@/modules/imagesAudit/ImagesAudit.report";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { buildView } from "@/modules/imagesAudit/ImagesAudit.logic";
import { ImagesAuditConfig, ImagesAuditData } from "@/modules/imagesAudit/ImagesAudit.types";
import { exportFiles } from "@/modules/imagesAudit/ImagesAudit.csv";
import { OverviewTab } from "@/modules/imagesAudit/tabs/Overview.tab";
import { FilesTab } from "@/modules/imagesAudit/tabs/Files.tab";
import { UsagesTab } from "@/modules/imagesAudit/tabs/Usages.tab";

const ImagesAuditPage: React.FC = () => {
  const controller = useReport<ImagesAuditData, ImagesAuditConfig>(imagesAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);

  const module = findModule("images-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);

  const [previousData, setPreviousData] = React.useState<Partial<ImagesAuditData> | undefined>(undefined);

  // The earlier run is rebuilt through the same view, so every tile compares like for like.
  const previousTiles = React.useMemo(
    () => {
      if (!previousData) return undefined;
      const previousView = buildView(previousData, config);
      return statTiles(previousView);
    },
    [previousData, config]
  );

  const usages = data?.usages ?? [];
  const hasData = view.files.length > 0 || usages.length > 0;

  if (controller.loading) {
    return <ReportSkeleton label="Opening report" />;
  }

  return (
    <>
      <PageHeader
        title={ImagesAuditContent.title}
        description={ImagesAuditContent.description}
        actions={
          module ? (
            <Badge label={`${ImagesAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={imagesAuditReport.kind}
          title={ImagesAuditContent.historyTitle}
          newLabel={ImagesAuditContent.run}
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
        title={imagesAuditReport.title}
        controller={controller}
        definition={imagesAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={ImagesAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={ImagesAuditContent.configTitle}
            definition={imagesAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: ImagesAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportFiles(view) },
              ]
            : []
        }
        runLabel={{
          run: ImagesAuditContent.run,
          rerun: ImagesAuditContent.rerun,
          pause: ImagesAuditContent.pause,
          resume: ImagesAuditContent.resume,
          cancel: ImagesAuditContent.cancel,
          configTitle: ImagesAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={ImagesAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: ImagesAuditContent.tabs.overview,
                content: <OverviewTab view={view} hasData={hasData} onRun={() => setConfigOpen(true)} previousTiles={previousTiles}
                    comparisonCards={
                      previousTiles ? (
                        <ComparisonCards sections={[{ title: "", tiles: compareTiles(statTiles(view), previousTiles) }]} />
                      ) : undefined
                    }
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={imagesAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<ImagesAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />,
              },
              {
                key: "files",
                label: ImagesAuditContent.tabs.files,
                count: view.files.length,
                content: <FilesTab files={view.files} />,
              },
              {
                key: "usages",
                label: ImagesAuditContent.tabs.usages,
                count: usages.length,
                content: <UsagesTab usages={usages} />,
              },
              {
                key: "duplicates",
                label: ImagesAuditContent.tabs.duplicates,
                count: view.duplicates.length,
                content: (
                  <FilesTab
                    files={view.duplicates}
                    emptyTitle={ImagesAuditContent.noDuplicates.title}
                    emptyDescription={ImagesAuditContent.noDuplicates.description}
                  />
                ),
              },
              {
                key: "unused",
                label: ImagesAuditContent.tabs.unused,
                count: view.unused.length,
                content: (
                  <FilesTab
                    files={view.unused}
                    emptyTitle={ImagesAuditContent.noUnused.title}
                    emptyDescription={ImagesAuditContent.noUnused.description}
                  />
                ),
              },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default ImagesAuditPage;
