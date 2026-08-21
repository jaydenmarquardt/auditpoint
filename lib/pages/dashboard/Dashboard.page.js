import * as React from "react";
import { AsyncBoundary } from "../../components/states/AsyncBoundary";
import { useAsync } from "../../core/hooks/useAsync";
import { Button } from "../../components/actions/Button";
import { Card } from "../../components/layout/Card";
import { PageHeader } from "../../components/layout/PageHeader";
import { StatTile } from "../../components/layout/StatTile";
import { Tokens } from "../../theme/Tokens";
import { GROUP_LABELS, ROUTES } from "../../app/App.routes";
import { navigate } from "../../core/state/App.store";
import { useActiveTaskCount } from "../../core/queue/Queue.store";
import { useApp } from "../../core/context/App.context";
import { useConfigCheck, useSettings } from "../../api/Settings.api";
import { findModule, isModuleEnabled } from "../../modules/Modules.registry";
import { Notice } from "../../components/feedback/Notice";
import { formatDateTime, formatNumber } from "../../utils/Format.util";
import { DashboardContent } from "./Dashboard.content";
import { loadDashboardSummary } from "./Dashboard.logic";
const Dashboard = () => {
    const summary = useAsync(loadDashboardSummary, { isEmpty: () => false });
    const activeTasks = useActiveTaskCount();
    const { access } = useApp();
    const config = useConfigCheck();
    const disabledModules = useSettings((settings) => settings.disabledModules);
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: DashboardContent.title, description: DashboardContent.description, actions: React.createElement(Button, { label: DashboardContent.refresh, iconName: "Refresh", onClick: summary.reload, busy: summary.status === "loading" }) }),
        React.createElement(AsyncBoundary, { result: summary }, (data) => (React.createElement("div", { style: { display: "flex", gap: Tokens.space.md, flexWrap: "wrap", marginBottom: Tokens.space.lg } },
            React.createElement(StatTile, { label: DashboardContent.stats.pages, value: formatNumber(data.pageCount) }),
            React.createElement(StatTile, { label: DashboardContent.stats.reports, value: formatNumber(data.reports.length), hint: data.latestReport
                    ? `Latest ${formatDateTime(data.latestReport.modified)}`
                    : DashboardContent.emptyReports }),
            React.createElement(StatTile, { label: DashboardContent.stats.running, value: formatNumber(activeTasks), tone: activeTasks > 0 ? "info" : "neutral", badge: activeTasks > 0 ? "Running" : undefined }),
            React.createElement(StatTile, { label: DashboardContent.stats.user, value: DashboardContent.admin, hint: access.user.title, tone: "success", badge: "Admin" })))),
        !config.configured && (React.createElement("div", { style: { marginBottom: Tokens.space.md } },
            React.createElement(Notice, { tone: "warning", message: `Modules are disabled until settings are complete: ${config.missing.join(", ")}.`, actions: React.createElement(Button, { label: "Open settings", onClick: () => navigate("settings") }) }))),
        ["audits", "tools", "system"].map((group) => {
            const routes = ROUTES.filter((route) => route.group === group &&
                route.key !== "dashboard" &&
                !route.hidden &&
                isModuleEnabled(route.key, disabledModules));
            if (routes.length === 0)
                return undefined;
            return (React.createElement("section", { key: group, style: { marginBottom: Tokens.space.lg } },
                React.createElement("h2", { style: { fontSize: Tokens.font.lg, margin: `0 0 ${Tokens.space.md}` } }, GROUP_LABELS[group]),
                React.createElement("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
                        gap: Tokens.space.md,
                    } }, routes.map((route) => {
                    const module = findModule(route.key);
                    const locked = Boolean(module) && (module === null || module === void 0 ? void 0 : module.requiresConfig) !== false && !config.configured;
                    return (React.createElement(Card, { key: route.key, onClick: () => navigate(locked ? "settings" : route.key) },
                        React.createElement("div", { style: { display: "flex", gap: Tokens.space.md, minWidth: 0 } },
                            React.createElement("span", { "aria-hidden": "true", style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 44,
                                    height: 44,
                                    flex: "0 0 auto",
                                    borderRadius: Tokens.radius.md,
                                    background: locked ? Tokens.colour.surfaceAlt : Tokens.colour.accentSoft,
                                    color: locked ? Tokens.colour.textMuted : Tokens.colour.accent,
                                    fontSize: 20,
                                } },
                                React.createElement("i", { className: `ms-Icon ms-Icon--${locked ? "Lock" : route.iconName}` })),
                            React.createElement("div", { style: { minWidth: 0, display: "grid", gap: 4 } },
                                React.createElement("strong", { style: { fontSize: Tokens.font.md } }, route.label),
                                React.createElement("span", { style: { color: Tokens.colour.textMuted, fontSize: Tokens.font.sm } }, route.description),
                                React.createElement("span", { style: {
                                        color: locked ? Tokens.colour.textMuted : Tokens.colour.accent,
                                        fontWeight: 600,
                                        fontSize: Tokens.font.sm,
                                    } }, locked ? "Configure to enable" : "Open")))));
                }))));
        })));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.page.js.map