import * as React from "react";
import { AppStyles } from "@/app/App.styles";
import { DEFAULT_ROUTE, findRoute } from "@/app/App.routes";
import { RouteView } from "@/app/RouteView";
import { Sidebar } from "@/app/Sidebar";
import { Topbar } from "@/app/Topbar";
import { QueueBar } from "@/app/QueueBar";
import { navigate, toggleSidebar, useAppState } from "@/core/state/App.store";
import { useFullscreen } from "@/core/hooks/useFullscreen";
import { useMediaQuery } from "@/core/hooks/useMediaQuery";
import { useApp } from "@/core/context/App.context";
import { readRoute } from "@/utils/Url.util";

export const Shell: React.FC = () => {
  const { route, sidebarOpen } = useAppState();
  const { access, webTitle, editMode } = useApp();
  const { fullscreen, toggle: toggleFullscreenView } = useFullscreen(!editMode);
  const isNarrow = useMediaQuery("(max-width: 900px)");

  // Deep links land on the right dashboard; an unknown key falls back rather than 404s.
  React.useEffect(() => {
    const requested = readRoute(DEFAULT_ROUTE);
    navigate(findRoute(requested) ? requested : DEFAULT_ROUTE);
  }, []);

  return (
    <div className="auditpoint-root" style={AppStyles.shell(fullscreen)}>
      <Topbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreenView}
        fullscreenAllowed={!editMode}
        userName={access.user.title}
        siteTitle={webTitle}
      />

      <div style={AppStyles.body}>
        <Sidebar
          open={sidebarOpen}
          activeKey={route}
          onNavigate={(key) => {
            navigate(key);
            if (isNarrow) toggleSidebar();
          }}
        />
        <main style={{ ...AppStyles.main, paddingBottom: 72 }} tabIndex={-1}>
          <RouteView routeKey={route} />
        </main>
      </div>

      <QueueBar />
    </div>
  );
};
