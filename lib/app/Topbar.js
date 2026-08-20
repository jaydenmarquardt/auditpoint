import * as React from "react";
import { AppContent } from "./App.content";
import { AppStyles } from "./App.styles";
import { Badge } from "../components/feedback/Badge";
import { IconButton } from "../components/actions/IconButton";
import { Tokens } from "../theme/Tokens";
import { useSettings } from "../api/Settings.api";
export const Topbar = ({ sidebarOpen, onToggleSidebar, fullscreen, onToggleFullscreen, fullscreenAllowed, activeTaskCount, onOpenQueue, userName, siteTitle, }) => {
    const settings = useSettings();
    return (React.createElement("header", { style: AppStyles.topbar },
        React.createElement(IconButton, { iconName: "GlobalNavButton", ariaLabel: sidebarOpen ? AppContent.nav.collapse : AppContent.nav.expand, tooltip: sidebarOpen ? AppContent.nav.collapse : AppContent.nav.expand, onClick: onToggleSidebar, toggled: sidebarOpen }),
        React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: Tokens.space.sm, minWidth: 0 } },
            React.createElement("strong", { style: { fontSize: Tokens.font.lg } }, settings.appName),
            React.createElement("span", { style: {
                    fontSize: Tokens.font.sm,
                    color: Tokens.colour.textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                } }, siteTitle)),
        React.createElement("div", { style: { flex: "1 1 auto" } }),
        React.createElement("button", { type: "button", onClick: onOpenQueue, style: {
                display: "flex",
                alignItems: "center",
                gap: Tokens.space.xs,
                minHeight: Tokens.hitTarget,
                padding: `0 ${Tokens.space.sm}`,
                border: "none",
                background: "transparent",
                font: "inherit",
                cursor: "pointer",
            } },
            React.createElement("i", { className: "ms-Icon ms-Icon--TaskManager", "aria-hidden": "true" }),
            React.createElement("span", null, AppContent.topbar.queue),
            React.createElement(Badge, { label: String(activeTaskCount), tone: activeTaskCount > 0 ? "info" : "neutral" })),
        React.createElement(IconButton, { iconName: fullscreen ? "BackToWindow" : "FullScreen", ariaLabel: fullscreen ? AppContent.topbar.fullscreenOff : AppContent.topbar.fullscreenOn, tooltip: fullscreenAllowed ? (fullscreen ? AppContent.topbar.fullscreenOff : AppContent.topbar.fullscreenOn) : AppContent.topbar.fullscreenBlocked, onClick: onToggleFullscreen, toggled: fullscreen, disabled: !fullscreenAllowed }),
        React.createElement("span", { style: { fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, whiteSpace: "nowrap" }, title: `${AppContent.topbar.signedInAs} ${userName}` }, userName)));
};
//# sourceMappingURL=Topbar.js.map