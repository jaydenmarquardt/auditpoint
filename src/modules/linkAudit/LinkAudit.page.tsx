import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { originOf } from "@/api/Links.api";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { linkAuditReport } from "@/modules/linkAudit/LinkAudit.report";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { buildView } from "@/modules/linkAudit/LinkAudit.logic";
import { AggregatedLink, LinkAuditConfig, LinkAuditData, Reference } from "@/modules/linkAudit/LinkAudit.types";
import {
  exportBrokenAudit,
  exportExternalAudit,
  exportFullAudit,
  exportReferenceList,
} from "@/modules/linkAudit/LinkAudit.csv";
import { OverviewTab } from "@/modules/linkAudit/tabs/Overview.tab";
import { ReferencesTab } from "@/modules/linkAudit/tabs/References.tab";
import { LinksTab } from "@/modules/linkAudit/tabs/Links.tab";
import { BrokenTab } from "@/modules/linkAudit/tabs/Broken.tab";
import { ReferenceDialog } from "@/modules/linkAudit/Reference.dialog";
import { LinkDialog } from "@/modules/linkAudit/Link.dialog";

const LinkAuditPage: React.FC = () => {
  const controller = useReport<LinkAuditData, LinkAuditConfig>(linkAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [reference, setReference] = React.useState<Reference | undefined>(undefined);
  const [link, setLink] = React.useState<AggregatedLink | undefined>(undefined);

  const module = findModule("link-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const origin = React.useMemo(() => originOf(controller.envelope?.sites?.[0]), [controller.envelope?.sites]);

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, origin), [data, origin, updatedIso]);

  const references = data?.references ?? [];
  const hasData = references.length > 0;

  return (
    <>
      <PageHeader
        title={LinkAuditContent.title}
        description={LinkAuditContent.description}
        actions={
          module ? (
            <Badge label={`${LinkAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={linkAuditReport.kind}
          title={LinkAuditContent.historyTitle}
          newLabel={LinkAuditContent.run}
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
        title={linkAuditReport.title}
        controller={controller}
        definition={linkAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={LinkAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={LinkAuditContent.configTitle}
            definition={linkAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        extraControls={
          hasData ? (
            <>
              <Button
                label={LinkAuditContent.exportCsv}
                iconName="ExcelDocument"
                onClick={() => exportFullAudit(references, view.links.length)}
              />
              <Button
                label={LinkAuditContent.exportExternal}
                iconName="ExcelDocument"
                disabled={view.totals.external === 0}
                onClick={() => exportExternalAudit(references, view.links.length)}
              />
              <Button
                label={LinkAuditContent.exportBroken}
                iconName="ExcelDocument"
                disabled={view.totals.broken === 0}
                onClick={() => exportBrokenAudit(references, view.links.length)}
              />
              <Button
                label={LinkAuditContent.exportReferences}
                iconName="ExcelDocument"
                onClick={() => exportReferenceList(references)}
              />
            </>
          ) : undefined
        }
        runLabel={{
          run: LinkAuditContent.run,
          rerun: LinkAuditContent.rerun,
          pause: LinkAuditContent.pause,
          resume: LinkAuditContent.resume,
          cancel: LinkAuditContent.cancel,
          configTitle: LinkAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={LinkAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: LinkAuditContent.tabs.overview,
                content: <OverviewTab view={view} hasData={hasData} onRun={() => setConfigOpen(true)} />,
              },
              {
                key: "references",
                label: LinkAuditContent.tabs.references,
                count: references.length,
                content: <ReferencesTab references={references} onSelect={setReference} />,
              },
              {
                key: "links",
                label: LinkAuditContent.tabs.links,
                count: view.links.length,
                content: <LinksTab links={view.links} onSelect={setLink} />,
              },
              {
                key: "broken",
                label: LinkAuditContent.tabs.broken,
                count: view.broken.length,
                content: <BrokenTab usages={view.broken} />,
              },
            ]}
          />
        </div>
      )}

      <ReferenceDialog reference={reference} onDismiss={() => setReference(undefined)} />
      <LinkDialog link={link} origin={origin} onDismiss={() => setLink(undefined)} />
    </>
  );
};

export default LinkAuditPage;
