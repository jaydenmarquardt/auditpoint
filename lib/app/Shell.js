import * as React from "react";
import { AppStyles } from "./App.styles";
import { DEFAULT_ROUTE, findRoute } from "./App.routes";
import { RouteView } from "./RouteView";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { QueueBar } from "./QueueBar";
import { navigate, toggleSidebar, useAppState } from "../core/state/App.store";
import { useFullscreen } from "../core/hooks/useFullscreen";
import { useMediaQuery } from "../core/hooks/useMediaQuery";
import { useApp } from "../core/context/App.context";
import { readRoute } from "../utils/Url.util";
export const Shell = () => {
    const { route, sidebarOpen } = useAppState();
    const { access, webTitle, editMode } = useApp();
    const { fullscreen, toggle: toggleFullscreenView } = useFullscreen(!editMode);
    const isNarrow = useMediaQuery("(max-width: 900px)");
    // Deep links land on the right dashboard; an unknown key falls back rather than 404s.
    React.useEffect(() => {
        const requested = readRoute(DEFAULT_ROUTE);
        navigate(findRoute(requested) ? requested : DEFAULT_ROUTE);
    }, []);
    return (React.createElement("div", { className: "auditpoint-root", style: AppStyles.shell(fullscreen) },
        React.createElement(Topbar, { sidebarOpen: sidebarOpen, onToggleSidebar: toggleSidebar, fullscreen: fullscreen, onToggleFullscreen: toggleFullscreenView, fullscreenAllowed: !editMode, userName: access.user.title, siteTitle: webTitle }),
        React.createElement("div", { style: AppStyles.body },
            React.createElement(Sidebar, { open: sidebarOpen, activeKey: route, onNavigate: (key) => {
                    navigate(key);
                    if (isNarrow)
                        toggleSidebar();
                } }),
            React.createElement("main", { style: Object.assign(Object.assign({}, AppStyles.main), { paddingBottom: 72 }), tabIndex: -1 },
                React.createElement(RouteView, { routeKey: route }))),
        React.createElement(QueueBar, null)));
};
//# sourceMappingURL=Shell.js.map