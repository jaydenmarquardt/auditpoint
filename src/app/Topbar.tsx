import * as React from "react";
import { AppContent } from "@/app/App.content";
import { AppStyles } from "@/app/App.styles";
import { Badge } from "@/components/feedback/Badge";
import { IconButton } from "@/components/actions/IconButton";
import { Tokens } from "@/theme/Tokens";
import { useSettings } from "@/api/Settings.api";

export interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  fullscreenAllowed: boolean;
  activeTaskCount: number;
  onOpenQueue: () => void;
  userName: string;
  siteTitle: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  fullscreen,
  onToggleFullscreen,
  fullscreenAllowed,
  activeTaskCount,
  onOpenQueue,
  userName,
  siteTitle,
}) => {
  const settings = useSettings();

  return (
  <header style={AppStyles.topbar}>
    <IconButton
      iconName="GlobalNavButton"
      ariaLabel={sidebarOpen ? AppContent.nav.collapse : AppContent.nav.expand}
      tooltip={sidebarOpen ? AppContent.nav.collapse : AppContent.nav.expand}
      onClick={onToggleSidebar}
      toggled={sidebarOpen}
    />

    <div style={{ display: "flex", alignItems: "baseline", gap: Tokens.space.sm, minWidth: 0 }}>
      <strong style={{ fontSize: Tokens.font.lg }}>{settings.appName}</strong>
      <span
        style={{
          fontSize: Tokens.font.sm,
          color: Tokens.colour.textMuted,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {siteTitle}
      </span>
    </div>

    <div style={{ flex: "1 1 auto" }} />

    <button
      type="button"
      onClick={onOpenQueue}
      style={{
        display: "flex",
        alignItems: "center",
        gap: Tokens.space.xs,
        minHeight: Tokens.hitTarget,
        padding: `0 ${Tokens.space.sm}`,
        border: "none",
        background: "transparent",
        font: "inherit",
        cursor: "pointer",
      }}
    >
      <i className="ms-Icon ms-Icon--TaskManager" aria-hidden="true" />
      <span>{AppContent.topbar.queue}</span>
      <Badge label={String(activeTaskCount)} tone={activeTaskCount > 0 ? "info" : "neutral"} />
    </button>

    <IconButton
      iconName={fullscreen ? "BackToWindow" : "FullScreen"}
      ariaLabel={fullscreen ? AppContent.topbar.fullscreenOff : AppContent.topbar.fullscreenOn}
      tooltip={fullscreenAllowed ? (fullscreen ? AppContent.topbar.fullscreenOff : AppContent.topbar.fullscreenOn) : AppContent.topbar.fullscreenBlocked}
      onClick={onToggleFullscreen}
      toggled={fullscreen}
      disabled={!fullscreenAllowed}
    />

    <span
      style={{ fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, whiteSpace: "nowrap" }}
      title={`${AppContent.topbar.signedInAs} ${userName}`}
    >
      {userName}
    </span>
  </header>
  );
};
