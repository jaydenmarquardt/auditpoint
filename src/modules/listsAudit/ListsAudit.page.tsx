import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { SiteList } from "@/api/Lists.types";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { statTiles } from "@/modules/listsAudit/ListsAudit.stats";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { listsAuditReport } from "@/modules/listsAudit/ListsAudit.report";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { buildView } from "@/modules/listsAudit/ListsAudit.logic";
import { ListsAuditConfig, ListsAuditData } from "@/modules/listsAudit/ListsAudit.types";
import { listColumns } from "@/modules/listsAudit/ListsAudit.columns";
import { OverviewTab } from "@/modules/listsAudit/tabs/Overview.tab";
import { AllListsTab } from "@/modules/listsAudit/tabs/AllLists.tab";
import { ListDialog } from "@/modules/listsAudit/List.dialog";
import { exportListsAudit } from "@/modules/listsAudit/ListsAudit.csv";

const ListsAuditPage: React.FC = () => {
  const controller = useReport<ListsAuditData, ListsAuditConfig>(listsAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [selectedList, setSelectedList] = React.useState<SiteList | undefined>(undefined);

  const module = findModule("lists-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data), [data, config, updatedIso]);

  const [previousData, setPreviousData] = React.useState<Partial<ListsAuditData> | undefined>(undefined);

  // The earlier run is rebuilt through the same view, so every tile compares like for like.
  const previousTiles = React.useMemo(
    () => {
      if (!previousData) return undefined;
      const previousView = buildView(previousData);
      return statTiles({ view: previousView, config });
    },
    [previousData, config]
  );

  const rows = data?.lists ?? [];
  const hasData = rows.length > 0;
  const columns = React.useMemo(() => listColumns(setSelectedList), []);

  return (
    <>
      <PageHeader
        title={ListsAuditContent.title}
        description={ListsAuditContent.description}
        actions={
          module ? (
            <Badge label={`${ListsAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={listsAuditReport.kind}
          title={ListsAuditContent.historyTitle}
          newLabel={ListsAuditContent.run}
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
        title={listsAuditReport.title}
        controller={controller}
        definition={listsAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={ListsAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={ListsAuditContent.configTitle}
            definition={listsAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        extraControls={
          hasData ? (
            <Button
              label={ListsAuditContent.exportCsv}
              iconName="ExcelDocument"
              onClick={() => exportListsAudit(data)}
            />
          ) : undefined
        }
        runLabel={{
          run: ListsAuditContent.run,
          rerun: ListsAuditContent.rerun,
          pause: ListsAuditContent.pause,
          resume: ListsAuditContent.resume,
          cancel: ListsAuditContent.cancel,
          configTitle: ListsAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={ListsAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: ListsAuditContent.tabs.overview,
                content: (
                  <OverviewTab view={view} config={config} hasData={hasData} onRun={() => setConfigOpen(true)} previousTiles={previousTiles}
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={listsAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<ListsAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />
                ),
              },
              {
                key: "lists",
                label: ListsAuditContent.tabs.lists,
                count: rows.length,
                content: <AllListsTab rows={rows} columns={columns} onSelect={setSelectedList} />,
              },
            ]}
          />
        </div>
      )}

      <ListDialog list={selectedList} onDismiss={() => setSelectedList(undefined)} />
    </>
  );
};


export default ListsAuditPage;
