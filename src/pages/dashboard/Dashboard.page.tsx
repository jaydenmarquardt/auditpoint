import * as React from "react";
import { AsyncBoundary } from "@/components/states/AsyncBoundary";
import { useAsync } from "@/core/hooks/useAsync";
import { Button } from "@/components/actions/Button";
import { Card } from "@/components/layout/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatTile } from "@/components/layout/StatTile";
import { Tokens } from "@/theme/Tokens";
import { GROUP_LABELS, ROUTES } from "@/app/App.routes";
import { navigate } from "@/core/state/App.store";
import { useActiveTaskCount } from "@/core/queue/Queue.store";
import { useApp } from "@/core/context/App.context";
import { useConfigCheck, useSettings } from "@/api/Settings.api";
import { findModule, isModuleEnabled } from "@/modules/Modules.registry";
import { Notice } from "@/components/feedback/Notice";
import { formatDateTime, formatNumber } from "@/utils/Format.util";
import { DashboardContent } from "@/pages/dashboard/Dashboard.content";
import { loadDashboardSummary } from "@/pages/dashboard/Dashboard.logic";

const Dashboard: React.FC = () => {
  const summary = useAsync(loadDashboardSummary, { isEmpty: () => false });
  const activeTasks = useActiveTaskCount();
  const { access } = useApp();
  const config = useConfigCheck();
  const disabledModules = useSettings((settings) => settings.disabledModules);

  return (
    <>
      <PageHeader
        title={DashboardContent.title}
        description={DashboardContent.description}
        actions={
          <Button
            label={DashboardContent.refresh}
            iconName="Refresh"
            onClick={summary.reload}
            busy={summary.status === "loading"}
          />
        }
      />

      <AsyncBoundary result={summary}>
        {(data) => (
          <div style={{ display: "flex", gap: Tokens.space.md, flexWrap: "wrap", marginBottom: Tokens.space.lg }}>
            <StatTile label={DashboardContent.stats.pages} value={formatNumber(data.pageCount)} />
            <StatTile
              label={DashboardContent.stats.reports}
              value={formatNumber(data.reports.length)}
              hint={
                data.latestReport
                  ? `Latest ${formatDateTime(data.latestReport.modified)}`
                  : DashboardContent.emptyReports
              }
            />
            <StatTile
              label={DashboardContent.stats.running}
              value={formatNumber(activeTasks)}
              tone={activeTasks > 0 ? "info" : "neutral"}
              badge={activeTasks > 0 ? "Running" : undefined}
            />
            <StatTile
              label={DashboardContent.stats.user}
              value={DashboardContent.admin}
              hint={access.user.title}
              tone="success"
              badge="Admin"
            />
          </div>
        )}
      </AsyncBoundary>

      {!config.configured && (
        <div style={{ marginBottom: Tokens.space.md }}>
          <Notice
            tone="warning"
            message={`Modules are disabled until settings are complete: ${config.missing.join(", ")}.`}
            actions={<Button label="Open settings" onClick={() => navigate("settings")} />}
          />
        </div>
      )}

      {(["audits", "tools", "system"] as const).map((group) => {
        const routes = ROUTES.filter(
          (route) =>
            route.group === group &&
            route.key !== "dashboard" &&
            !route.hidden &&
            isModuleEnabled(route.key, disabledModules)
        );

        if (routes.length === 0) return undefined;

        return (
          <section key={group} style={{ marginBottom: Tokens.space.lg }}>
            <h2 style={{ fontSize: Tokens.font.lg, margin: `0 0 ${Tokens.space.md}` }}>{GROUP_LABELS[group]}</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
                gap: Tokens.space.md,
              }}
            >
              {routes.map((route) => {
                const module = findModule(route.key);
                const locked = Boolean(module) && module?.requiresConfig !== false && !config.configured;

                return (
                  <Card
                    key={route.key}
                    title={route.label}
                    subtitle={route.description}
                    onClick={() => navigate(locked ? "settings" : route.key)}
                    actions={
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: Tokens.radius.sm,
                          background: Tokens.colour.accentSoft,
                          color: Tokens.colour.accent,
                        }}
                      >
                        <i className={`ms-Icon ms-Icon--${locked ? "Lock" : route.iconName}`} />
                      </span>
                    }
                  >
                    <span style={{ color: locked ? Tokens.colour.textMuted : Tokens.colour.accent, fontWeight: 600 }}>
                      {locked ? "Configure to enable" : "Open"}
                    </span>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

    </>
  );
};

export default Dashboard;
