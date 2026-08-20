import * as React from "react";
import { findRoute } from "./App.routes";
import { ErrorBoundary } from "../components/states/ErrorBoundary";
import { LoadingState } from "../components/states/Loading.state";
import { EmptyState } from "../components/states/Empty.state";
import { findModule, isModuleEnabled } from "../modules/Modules.registry";
import { useConfigCheck, useSettings } from "../api/Settings.api";
import { navigate } from "../core/state/App.store";
import { AppContent } from "./App.content";
const cache = new Map();
function resolve(routeKey) {
    const route = findRoute(routeKey);
    if (!route)
        return undefined;
    const cached = cache.get(routeKey);
    if (cached)
        return cached;
    const lazy = React.lazy(route.load);
    cache.set(routeKey, lazy);
    return lazy;
}
/** Resolves the route key to a lazily-imported page, remounting on every change. */
export const RouteView = ({ routeKey }) => {
    const config = useConfigCheck();
    const disabled = useSettings((settings) => settings.disabledModules);
    const Page = resolve(routeKey);
    const module = findModule(routeKey);
    // A module switched off in settings, or ruled out by the host, is not routable.
    if (module && !isModuleEnabled(routeKey, disabled)) {
        return (React.createElement(EmptyState, { title: AppContent.disabled.title, description: AppContent.disabled.description, iconName: "Blocked", actionLabel: AppContent.disabled.action, onAction: () => navigate("settings") }));
    }
    if (module && module.requiresConfig !== false && !config.configured) {
        return (React.createElement(EmptyState, { title: AppContent.config.title, description: `${AppContent.config.description} ${config.missing.join(", ")}.`, iconName: "Lock", actionLabel: AppContent.config.action, onAction: () => navigate("settings") }));
    }
    if (!Page) {
        return (React.createElement(EmptyState, { title: "Dashboard not found", description: `No dashboard is registered under "${routeKey}".`, iconName: "PageRemove" }));
    }
    return (React.createElement(ErrorBoundary, { key: routeKey },
        React.createElement(React.Suspense, { fallback: React.createElement(LoadingState, null) },
            React.createElement(Page, null))));
};
//# sourceMappingURL=RouteView.js.map