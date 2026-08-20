import { MODULES } from "../modules/Modules.registry";
const SYSTEM_ROUTES = [
    {
        key: "dashboard",
        label: "Overview",
        iconName: "ViewDashboard",
        description: "Site health at a glance.",
        group: "overview",
        load: () => import(/* webpackChunkName: "page-dashboard" */ "@/pages/dashboard/Dashboard.page"),
    },
    {
        key: "components",
        label: "Component board",
        iconName: "Color",
        description: "Every shared control, state and chart.",
        group: "system",
        load: () => import(
        /* webpackChunkName: "page-component-board" */ "@/pages/componentBoard/ComponentBoard.page"),
    },
    {
        key: "queue",
        label: "Task queue",
        iconName: "TaskManager",
        description: "Scans and long jobs currently running.",
        group: "system",
        load: () => import(/* webpackChunkName: "page-queue" */ "@/pages/queue/Queue.page"),
    },
    {
        key: "reports",
        label: "Reports",
        iconName: "ReportDocument",
        description: "Saved report output.",
        group: "system",
        load: () => import(/* webpackChunkName: "page-reports" */ "@/pages/reports/Reports.page"),
    },
    {
        key: "settings",
        label: "Settings",
        iconName: "Settings",
        description: "Sites, report location and throttling.",
        group: "system",
        load: () => import(/* webpackChunkName: "page-settings" */ "@/pages/settings/Settings.page"),
    },
];
export const ROUTES = [
    ...SYSTEM_ROUTES.filter((route) => route.group === "overview"),
    ...MODULES.map((app) => ({
        key: app.key,
        label: app.label,
        iconName: app.iconName,
        description: app.description,
        group: app.group,
        hidden: app.hidden,
        load: app.load,
    })),
    ...SYSTEM_ROUTES.filter((route) => route.group !== "overview"),
];
export const DEFAULT_ROUTE = "dashboard";
export function findRoute(key) {
    return ROUTES.find((route) => route.key === key);
}
export const GROUP_LABELS = {
    overview: "Overview",
    audits: "Audits",
    tools: "Tools",
    system: "System",
};
//# sourceMappingURL=App.routes.js.map