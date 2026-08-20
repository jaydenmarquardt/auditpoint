import * as React from "react";
import { AppContent } from "./App.content";
import { AppStyles } from "./App.styles";
import { GROUP_LABELS, ROUTES } from "./App.routes";
import { APP_VERSION } from "../version";
import { useConfigCheck, useSettings } from "../api/Settings.api";
import { findModule, isModuleEnabled } from "../modules/Modules.registry";
const GROUP_ORDER = ["overview", "audits", "tools", "system"];
export const Sidebar = ({ open, activeKey, onNavigate }) => {
    const appName = useSettings((settings) => settings.appName);
    const disabled = useSettings((settings) => settings.disabledModules);
    const config = useConfigCheck();
    return (React.createElement("nav", { "aria-label": AppContent.nav.label, "aria-hidden": !open, style: AppStyles.sidebar(open) },
        React.createElement("div", { style: { display: "flex", flexDirection: "column", minHeight: "100%" } },
            React.createElement("div", { style: { flex: "1 1 auto" } }, GROUP_ORDER.map((group) => {
                const routes = ROUTES.filter((route) => route.group === group && !route.hidden && isModuleEnabled(route.key, disabled));
                if (routes.length === 0)
                    return undefined;
                return (React.createElement("div", { key: group },
                    React.createElement("div", { style: AppStyles.navGroupLabel }, GROUP_LABELS[group]),
                    React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, routes.map((route) => {
                        const module = findModule(route.key);
                        const locked = Boolean(module) && (module === null || module === void 0 ? void 0 : module.requiresConfig) !== false && !config.configured;
                        return (React.createElement("li", { key: route.key },
                            React.createElement("button", { type: "button", style: Object.assign(Object.assign({}, AppStyles.navItem(route.key === activeKey)), { opacity: locked ? 0.55 : 1 }), "aria-current": route.key === activeKey ? "page" : undefined, "aria-disabled": locked, onClick: () => onNavigate(locked ? "settings" : route.key), title: locked ? AppContent.config.navHint : route.description, tabIndex: open ? 0 : -1 },
                                React.createElement("i", { className: `ms-Icon ms-Icon--${locked ? "Lock" : route.iconName}`, "aria-hidden": "true" }),
                                React.createElement("span", { style: { whiteSpace: "nowrap" } }, route.label))));
                    }))));
            })),
            React.createElement("div", { style: AppStyles.footer },
                React.createElement("span", { style: { whiteSpace: "nowrap" } },
                    appName,
                    " \u00B7 ",
                    AppContent.footer.version,
                    " ",
                    APP_VERSION)))));
};
//# sourceMappingURL=Sidebar.js.map