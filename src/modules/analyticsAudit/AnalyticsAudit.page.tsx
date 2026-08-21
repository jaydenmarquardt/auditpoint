import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportSkeleton } from "@/modules/shared/ReportSkeleton";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Dropdown } from "@/components/inputs/Dropdown";
import { Theme } from "@/theme/Theme.api";
import { getSettings } from "@/api/Settings.api";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { ComparisonCards } from "@/modules/shared/ComparisonCards";
import { compareTiles } from "@/modules/shared/StatSections";
import { analyticsAuditReport } from "@/modules/analyticsAudit/AnalyticsAudit.report";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { buildView } from "@/modules/analyticsAudit/AnalyticsAudit.logic";
import { statTiles } from "@/modules/analyticsAudit/AnalyticsAudit.stats";
import { exportAnalyticsAudit } from "@/modules/analyticsAudit/AnalyticsAudit.csv";
import {
  AnalyticsAuditConfig,
  AnalyticsAuditData,
  WindowKey,
} from "@/modules/analyticsAudit/AnalyticsAudit.types";
import { OverviewTab } from "@/modules/analyticsAudit/tabs/Overview.tab";
import { EntriesTab } from "@/modules/analyticsAudit/tabs/Entries.tab";

const WINDOWS: WindowKey[] = ["today", "last7", "last30", "last90", "allTime"];

const AnalyticsAuditPage: React.FC = () => {
  const controller = useReport<AnalyticsAuditData, AnalyticsAuditConfig>(analyticsAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState<WindowKey>("last30");
  const [previousData, setPreviousData] = React.useState<Partial<AnalyticsAuditData> | undefined>(undefined);

  const module = findModule("analytics-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, activeWindow), [data, activeWindow, updatedIso]);

  const previousTiles = React.useMemo(
    () => (previousData ? statTiles(buildView(previousData, activeWindow), activeWindow) : undefined),
    [previousData, activeWindow]
  );

  const entries = data?.entries ?? [];
  const hasData = entries.length > 0;

  if (controller.loading) {
    return <ReportSkeleton label="Opening report" />;
  }

  return (
    <>
      <PageHeader
        title={AnalyticsAuditContent.title}
        description={AnalyticsAuditContent.description}
        actions={
          module ? (
            <Badge
              label={`${AnalyticsAuditContent.moduleVersion} ${module.version}`}
              tone="neutral"
              showIcon={false}
            />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={analyticsAuditReport.kind}
          title={AnalyticsAuditContent.historyTitle}
          newLabel={AnalyticsAuditContent.run}
          busy={controller.running || controller.loading}
          onNew={() => setConfigOpen(true)}
          onOpen={(url) => controller.open(url)}
          onResume={(url) => controller.resumeSaved(url)}
          onImport={(file) => void controller.importJson(file)}
          error={controller.error}
          onDismissError={controller.clearError}
        />
      )}

      <ReportRunPanel
        title={analyticsAuditReport.title}
        controller={controller}
        definition={analyticsAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={AnalyticsAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={AnalyticsAuditContent.configTitle}
            definition={analyticsAuditReport}
            config={{
              ...controller.config,
              // The column mapping already knows the site's area column.
              orgUnitColumn: controller.config.orgUnitColumn || getSettings().fields.organisationalUnit,
            }}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                {
                  key: "csv",
                  label: AnalyticsAuditContent.exportCsv,
                  iconName: "ExcelDocument",
                  onClick: () => exportAnalyticsAudit(data),
                },
              ]
            : []
        }
        runLabel={{
          run: AnalyticsAuditContent.run,
          rerun: AnalyticsAuditContent.rerun,
          pause: AnalyticsAuditContent.pause,
          resume: AnalyticsAuditContent.resume,
          cancel: AnalyticsAuditContent.cancel,
          configTitle: AnalyticsAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <div style={{ maxWidth: 260, marginBottom: Theme.tokens.space.md }}>
            <Dropdown
              label={AnalyticsAuditContent.windows.label}
              options={WINDOWS.map((key) => ({ key, text: AnalyticsAuditContent.windows[key] }))}
              selectedKey={activeWindow}
              onChange={(key) => setActiveWindow(key as WindowKey)}
            />
          </div>

          <Tabs
            ariaLabel={AnalyticsAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: AnalyticsAuditContent.tabs.overview,
                content: (
                  <OverviewTab
                    view={view}
                    window={activeWindow}
                    hasData={hasData}
                    sampled={Boolean(data?.activitySampled)}
                    onRun={() => setConfigOpen(true)}
                    previousTiles={previousTiles}
                    comparisonCards={
                      previousTiles ? (
                        <ComparisonCards
                          sections={[{ title: "", tiles: compareTiles(statTiles(view, activeWindow), previousTiles) }]}
                        />
                      ) : undefined
                    }
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={analyticsAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<AnalyticsAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />
                ),
              },
              {
                key: "pages",
                label: AnalyticsAuditContent.tabs.pages,
                count: view.pages.length,
                content: <EntriesTab entries={view.pages} window={activeWindow} />,
              },
              {
                key: "files",
                label: AnalyticsAuditContent.tabs.files,
                count: view.files.length,
                content: <EntriesTab entries={view.files} window={activeWindow} />,
              },
              {
                key: "unviewed",
                label: AnalyticsAuditContent.tabs.unviewed,
                count: view.unviewed.length,
                content: (
                  <EntriesTab
                    entries={view.unviewed}
                    window={activeWindow}
                    emptyTitle={AnalyticsAuditContent.tabs.unviewed}
                    emptyDescription={AnalyticsAuditContent.empty.unviewed}
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

export default AnalyticsAuditPage;
