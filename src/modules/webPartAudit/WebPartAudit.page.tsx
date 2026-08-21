import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportSkeleton } from "@/modules/shared/ReportSkeleton";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { WebPartInstance } from "@/api/WebParts.types";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { statTiles } from "@/modules/webPartAudit/WebPartAudit.stats";
import { ComparisonBar } from "@/modules/shared/ComparisonBar";
import { ComparisonCards } from "@/modules/shared/ComparisonCards";
import { compareTiles } from "@/modules/shared/StatSections";
import { webPartAuditReport } from "@/modules/webPartAudit/WebPartAudit.report";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { buildView } from "@/modules/webPartAudit/WebPartAudit.logic";
import {
  WebPartAuditConfig,
  WebPartAuditData,
  WebPartPageSummary,
  WebPartTypeSummary,
} from "@/modules/webPartAudit/WebPartAudit.types";
import { OverviewTab } from "@/modules/webPartAudit/tabs/Overview.tab";
import { TypesTab } from "@/modules/webPartAudit/tabs/Types.tab";
import { InstancesTab } from "@/modules/webPartAudit/tabs/Instances.tab";
import { PagesTab } from "@/modules/webPartAudit/tabs/Pages.tab";
import { CatalogueTab } from "@/modules/webPartAudit/tabs/Catalogue.tab";
import { WebPartTypeDialog } from "@/modules/webPartAudit/WebPartType.dialog";
import { PageDialog } from "@/modules/webPartAudit/Page.dialog";
import { exportWebPartAudit } from "@/modules/webPartAudit/WebPartAudit.csv";

const WebPartAuditPage: React.FC = () => {
  const controller = useReport<WebPartAuditData, WebPartAuditConfig>(webPartAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<WebPartTypeSummary | undefined>(undefined);
  const [selectedPage, setSelectedPage] = React.useState<WebPartPageSummary | undefined>(undefined);

  const module = findModule("webpart-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data), [data, updatedIso]);

  const [previousData, setPreviousData] = React.useState<Partial<WebPartAuditData> | undefined>(undefined);

  // The earlier run is rebuilt through the same view, so every tile compares like for like.
  const previousTiles = React.useMemo(
    () => {
      if (!previousData) return undefined;
      const previousView = buildView(previousData);
      return statTiles(previousView);
    },
    [previousData]
  );

  const instances = data?.instances ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pages = React.useMemo(() => data?.pages ?? [], [data, updatedIso]);
  const hasData = instances.length > 0 || pages.length > 0;

  const openPageFor = React.useCallback(
    (instance: WebPartInstance) =>
      setSelectedPage(pages.find((page) => page.pageId === instance.pageId && page.siteUrl === instance.siteUrl)),
    [pages]
  );

  if (controller.loading) {
    return <ReportSkeleton label="Opening report" />;
  }

  return (
    <>
      <PageHeader
        title={WebPartAuditContent.title}
        description={WebPartAuditContent.description}
        actions={
          module ? (
            <Badge label={`${WebPartAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={webPartAuditReport.kind}
          title={WebPartAuditContent.historyTitle}
          newLabel={WebPartAuditContent.run}
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
        title={webPartAuditReport.title}
        controller={controller}
        definition={webPartAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={WebPartAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={WebPartAuditContent.configTitle}
            definition={webPartAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: WebPartAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportWebPartAudit(data) },
              ]
            : []
        }
        runLabel={{
          run: WebPartAuditContent.run,
          rerun: WebPartAuditContent.rerun,
          pause: WebPartAuditContent.pause,
          resume: WebPartAuditContent.resume,
          cancel: WebPartAuditContent.cancel,
          configTitle: WebPartAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={WebPartAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: WebPartAuditContent.tabs.overview,
                content: <OverviewTab view={view} hasData={hasData} onRun={() => setConfigOpen(true)} previousTiles={previousTiles}
                    comparisonCards={
                      previousTiles ? (
                        <ComparisonCards sections={[{ title: "", tiles: compareTiles(statTiles(view), previousTiles) }]} />
                      ) : undefined
                    }
                    comparison={
                      hasData ? (
                        <ComparisonBar
                          kind={webPartAuditReport.kind}
                          currentId={controller.envelope?.id}
                          onChange={(next) => setPreviousData(next as Partial<WebPartAuditData> | undefined)}
                        />
                      ) : undefined
                    }
                  />,
              },
              {
                key: "types",
                label: WebPartAuditContent.tabs.types,
                count: view.types.length,
                content: <TypesTab types={view.types} onSelect={setSelectedType} />,
              },
              {
                key: "instances",
                label: WebPartAuditContent.tabs.instances,
                count: instances.length,
                content: <InstancesTab instances={instances} onOpenPage={openPageFor} />,
              },
              {
                key: "pages",
                label: WebPartAuditContent.tabs.pages,
                count: pages.length,
                content: <PagesTab pages={pages} onSelect={setSelectedPage} />,
              },
              {
                key: "catalogue",
                label: WebPartAuditContent.tabs.catalogue,
                count: view.catalogueOnly.length,
                content: <CatalogueTab rows={view.catalogueOnly} />,
              },
            ]}
          />
        </div>
      )}

      <WebPartTypeDialog
        type={selectedType}
        instances={instances}
        onDismiss={() => setSelectedType(undefined)}
        onOpenPage={openPageFor}
      />

      <PageDialog page={selectedPage} instances={instances} onDismiss={() => setSelectedPage(undefined)} />
    </>
  );
};


export default WebPartAuditPage;
