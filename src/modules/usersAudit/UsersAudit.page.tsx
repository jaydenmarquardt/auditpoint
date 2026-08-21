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
import { usersAuditReport } from "@/modules/usersAudit/UsersAudit.report";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { buildView } from "@/modules/usersAudit/UsersAudit.logic";
import { UsersAuditConfig, UsersAuditData } from "@/modules/usersAudit/UsersAudit.types";
import { exportUsers } from "@/modules/usersAudit/UsersAudit.csv";
import { OverviewTab } from "@/modules/usersAudit/tabs/Overview.tab";
import { UsersTab } from "@/modules/usersAudit/tabs/Users.tab";
import { GroupsTab } from "@/modules/usersAudit/tabs/Groups.tab";
import { UserDialog } from "@/modules/usersAudit/User.dialog";
import { SiteUser, UserProfileSummary } from "@/api/Users.types";
import { groupsByLogin } from "@/modules/usersAudit/UsersAudit.logic";

const UsersAuditPage: React.FC = () => {
  const controller = useReport<UsersAuditData, UsersAuditConfig>(usersAuditReport);
  const [tab, setTab] = React.useState("overview");
  const [configOpen, setConfigOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<SiteUser | undefined>(undefined);
  const [extraProfiles, setExtraProfiles] = React.useState<UserProfileSummary[]>([]);

  const module = findModule("users-audit");
  const data = controller.envelope?.data;
  const updatedIso = controller.envelope?.updatedIso;
  const config = controller.envelope?.config ?? controller.config;

  // Stages mutate data in place, so the envelope timestamp is what changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const view = React.useMemo(() => buildView(data, config), [data, config, updatedIso]);

  const users = data?.users ?? [];
  const groups = data?.groups ?? [];
  const profiles = [...(data?.profiles ?? []), ...extraProfiles];
  const hasData = users.length > 0;

  return (
    <>
      <PageHeader
        title={UsersAuditContent.title}
        description={UsersAuditContent.description}
        actions={
          module ? (
            <Badge label={`${UsersAuditContent.moduleVersion} ${module.version}`} tone="neutral" showIcon={false} />
          ) : undefined
        }
      />

      {!controller.envelope && !controller.running && (
        <ReportHistory
          kind={usersAuditReport.kind}
          title={UsersAuditContent.historyTitle}
          newLabel={UsersAuditContent.run}
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
        title={usersAuditReport.title}
        controller={controller}
        definition={usersAuditReport}
        onBack={controller.envelope ? controller.clear : undefined}
        backLabel={UsersAuditContent.backToRuns}
        configOpen={configOpen}
        onConfigOpenChange={setConfigOpen}
        configPanel={
          <ReportConfigPanel
            bare
            title={UsersAuditContent.configTitle}
            definition={usersAuditReport}
            config={controller.config}
            onChange={controller.setConfig}
          />
        }
        menuItems={
          hasData
            ? [
                { key: "csv", label: UsersAuditContent.exportCsv, iconName: "ExcelDocument", onClick: () => exportUsers(data) },
              ]
            : []
        }
        runLabel={{
          run: UsersAuditContent.run,
          rerun: UsersAuditContent.rerun,
          pause: UsersAuditContent.pause,
          resume: UsersAuditContent.resume,
          cancel: UsersAuditContent.cancel,
          configTitle: UsersAuditContent.configTitle,
        }}
      />

      {(controller.envelope || controller.running) && (
        <div style={{ marginTop: Theme.tokens.space.lg, minWidth: 0 }}>
          <Tabs
            ariaLabel={UsersAuditContent.title}
            selectedKey={tab}
            onChange={setTab}
            items={[
              {
                key: "overview",
                label: UsersAuditContent.tabs.overview,
                content: (
                  <OverviewTab view={view} config={config} hasData={hasData} onRun={() => setConfigOpen(true)} />
                ),
              },
              {
                key: "users",
                label: UsersAuditContent.tabs.users,
                count: users.length,
                content: (
                  <UsersTab
                    users={users}
                    groups={groups}
                    recentDays={config.recentDays}
                    onSelect={setSelectedUser}
                  />
                ),
              },
              {
                key: "groups",
                label: UsersAuditContent.tabs.groups,
                count: groups.length,
                content: <GroupsTab groups={groups} />,
              },
            ]}
          />
        </div>
      )}
      <UserDialog
        user={selectedUser}
        profiles={profiles}
        groups={
          selectedUser
            ? groupsByLogin(groups).get(selectedUser.loginName.toLowerCase()) ?? []
            : []
        }
        onLoaded={(profile) => setExtraProfiles((current) => [...current, profile])}
        onDismiss={() => setSelectedUser(undefined)}
      />
    </>
  );
};

export default UsersAuditPage;
