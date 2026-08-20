import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { indexingAuditReport } from "@/modules/indexingAudit/IndexingAudit.report";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";
import { buildView } from "@/modules/indexingAudit/IndexingAudit.logic";
import { IndexingAuditConfig, IndexingAuditData } from "@/modules/indexingAudit/IndexingAudit.types";
import { OverviewTab } from "@/modules/indexingAudit/tabs/Overview.tab";
import { ListsTab } from "@/modules/indexingAudit/tabs/Lists.tab";
import { ItemsTab } from "@/modules/indexingAudit/tabs/Items.tab";
import { PropertiesTab } from "@/modules/indexingAudit/tabs/Properties.tab";
import { exportIndexingAudit } from "@/modules/indexingAudit/IndexingAudit.csv";

const IndexingAuditPage: React.FC = () => {
  const controller = useReport<IndexingAuditData, IndexingAuditConfig>(indexingAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);

  const module = findModule("indexing-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);

  const lists = data?.lists ?? [];
  const items = data?.items ?? [];
  const properties = data?.managedProperties ?? [];
  const hasData = lists.length > 0;

  return (
    <>
      <PageHeader
        title={IndexingAuditContent.title}
        description={IndexingAuditContent.description}
        actions={
          module ? (
            <Badge
              label={`${IndexingAuditContent.moduleVersion} ${module.version}`}
              tone="neutral"
              showIcon={false}
            />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={indexingAuditReport.kind}
          title={IndexingAuditContent.historyTitle}
          newLabel={IndexingAuditContent.run}
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
        title={indexingAuditReport.title}
        controller={controller}
        definition={indexingAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={IndexingAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={IndexingAuditContent.configTitle}
            definition={indexingAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        extraControls={
          hasData ? (
            <Button
              label={IndexingAuditContent.exportCsv}
              iconName="ExcelDocument"
              onClick={() => exportIndexingAudit(data)}
            />
          ) : undefined
        }
        runLabel={{
          run: IndexingAuditContent.run,
          rerun: IndexingAuditContent.rerun,
          pause: IndexingAuditContent.pause,
          resume: IndexingAuditContent.resume,
          cancel: IndexingAuditContent.cancel,
          configTitle: IndexingAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={IndexingAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: IndexingAuditContent.tabs.overview,
                content: (
                  <OverviewTab view={view} config={config} hasData={hasData} onRun={() => setConfigOpen(true)} />
                ),
              },
              {
                key: "lists",
                label: IndexingAuditContent.tabs.lists,
                count: lists.length,
                content: <ListsTab rows={lists} target={config.coverageWarningPercent} />,
              },
              {
                key: "items",
                label: IndexingAuditContent.tabs.items,
                count: items.length,
                content: <ItemsTab rows={items} />,
              },
              {
                key: "properties",
                label: IndexingAuditContent.tabs.properties,
                count: properties.length,
                content: <PropertiesTab properties={properties} />,
              },
            ]}
          />
        </div>
      )}
    </>
  );
};


export default IndexingAuditPage;
