import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs } from "@/components/data/Tabs";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { useReport } from "@/core/report/useReport";
import { ReportRunPanel } from "@/modules/shared/ReportRunPanel";
import { ReportConfigPanel } from "@/modules/shared/ReportConfigPanel";
import { ReportHistory } from "@/modules/shared/ReportHistory";
import { findModule } from "@/modules/Modules.registry";
import { permissionsAuditReport } from "@/modules/permissionsAudit/PermissionsAudit.report";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { buildView } from "@/modules/permissionsAudit/PermissionsAudit.logic";
import { PermissionsAuditConfig, PermissionsAuditData } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { OverviewTab } from "@/modules/permissionsAudit/tabs/Overview.tab";
import { GroupsTab } from "@/modules/permissionsAudit/tabs/Groups.tab";
import { LevelsTab } from "@/modules/permissionsAudit/tabs/Levels.tab";
import { GrantsTab } from "@/modules/permissionsAudit/tabs/Grants.tab";
import { UniqueTab } from "@/modules/permissionsAudit/tabs/Unique.tab";
import { GroupDialog } from "@/modules/permissionsAudit/Group.dialog";
import { LevelDialog } from "@/modules/permissionsAudit/Level.dialog";
import { BrokenItemsTab } from "@/modules/permissionsAudit/tabs/BrokenItems.tab";
import { PermissionLevel } from "@/api/SitePermissions.types";
import { exportPermissionsAudit } from "@/modules/permissionsAudit/PermissionsAudit.csv";

const PermissionsAuditPage: React.FC = () => {
  const controller = useReport<PermissionsAuditData, PermissionsAuditConfig>(permissionsAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<SiteGroupSummary | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = React.useState<PermissionLevel | undefined>(undefined);

  const module = findModule("permissions-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data), [data, updatedIso]);

  const groups = data?.groups ?? [];
  const levels = data?.levels ?? [];
  const grants = data?.grants ?? [];
  const scopes = data?.scopes ?? [];
  const hasData = grants.length > 0 || groups.length > 0;

  return (
    <>
      <PageHeader
        title={PermissionsAuditContent.title}
        description={PermissionsAuditContent.description}
        actions={
          module ? (
            <Badge
              label={`${PermissionsAuditContent.moduleVersion} ${module.version}`}
              tone="neutral"
              showIcon={false}
            />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={permissionsAuditReport.kind}
          title={PermissionsAuditContent.historyTitle}
          newLabel={PermissionsAuditContent.run}
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
        title={permissionsAuditReport.title}
        controller={controller}
        definition={permissionsAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={PermissionsAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={PermissionsAuditContent.configTitle}
            definition={permissionsAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: PermissionsAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportPermissionsAudit(data) },
              ]
            : []
        }
        runLabel={{
          run: PermissionsAuditContent.run,
          rerun: PermissionsAuditContent.rerun,
          pause: PermissionsAuditContent.pause,
          resume: PermissionsAuditContent.resume,
          cancel: PermissionsAuditContent.cancel,
          configTitle: PermissionsAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={PermissionsAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: PermissionsAuditContent.tabs.overview,
                content: (
                  <OverviewTab view={view} config={config} hasData={hasData} onRun={() => setConfigOpen(true)} />
                ),
              },
              {
                key: "groups",
                label: PermissionsAuditContent.tabs.groups,
                count: groups.length,
                content: <GroupsTab groups={groups} onSelect={setSelectedGroup} />,
              },
              {
                key: "levels",
                label: PermissionsAuditContent.tabs.levels,
                count: levels.length,
                content: <LevelsTab levels={levels} onSelect={setSelectedLevel} />,
              },
              {
                key: "grants",
                label: PermissionsAuditContent.tabs.grants,
                count: grants.length,
                content: <GrantsTab grants={grants} />,
              },
              {
                key: "items",
                label: PermissionsAuditContent.tabs.items,
                count: (data?.brokenItems ?? []).length,
                content: (
                  <BrokenItemsTab items={data?.brokenItems ?? []} enabled={config.checkItemBreaks} />
                ),
              },
              {
                key: "unique",
                label: PermissionsAuditContent.tabs.unique,
                count: scopes.length,
                content: <UniqueTab scopes={scopes} />,
              },
            ]}
          />
        </div>
      )}

      <GroupDialog group={selectedGroup} grants={grants} onDismiss={() => setSelectedGroup(undefined)} />

      <LevelDialog level={selectedLevel} grants={grants} onDismiss={() => setSelectedLevel(undefined)} />
    </>
  );
};


export default PermissionsAuditPage;
