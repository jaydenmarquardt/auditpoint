import * as React from "react";
import { AppContent } from "@/app/App.content";
import { AppStyles } from "@/app/App.styles";
import { GROUP_LABELS, ROUTES, RouteDefinition } from "@/app/App.routes";
import { APP_VERSION } from "@/version";
import { useConfigCheck, useSettings } from "@/api/Settings.api";
import { findModule, isModuleEnabled } from "@/modules/Modules.registry";

export interface SidebarProps {
  open: boolean;
  activeKey: string;
  onNavigate: (key: string) => void;
}

const GROUP_ORDER: RouteDefinition["group"][] = ["overview", "audits", "tools", "system"];

export const Sidebar: React.FC<SidebarProps> = ({ open, activeKey, onNavigate }) => {
  const appName = useSettings((settings) => settings.appName);
  const disabled = useSettings((settings) => settings.disabledModules);
  const config = useConfigCheck();

  return (
  <nav
    aria-label={AppContent.nav.label}
    aria-hidden={!open}
    style={AppStyles.sidebar(open)}
  >
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ flex: "1 1 auto" }}>
        {GROUP_ORDER.map((group) => {
          const routes = ROUTES.filter(
            (route) => route.group === group && !route.hidden && isModuleEnabled(route.key, disabled)
          );
          if (routes.length === 0) return undefined;

          return (
            <div key={group}>
              <div style={AppStyles.navGroupLabel}>{GROUP_LABELS[group]}</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {routes.map((route) => {
                  const module = findModule(route.key);
                  const locked = Boolean(module) && module?.requiresConfig !== false && !config.configured;

                  return (
                    <li key={route.key}>
                      <button
                        type="button"
                        style={{ ...AppStyles.navItem(route.key === activeKey), opacity: locked ? 0.55 : 1 }}
                        aria-current={route.key === activeKey ? "page" : undefined}
                        aria-disabled={locked}
                        onClick={() => onNavigate(locked ? "settings" : route.key)}
                        title={locked ? AppContent.config.navHint : route.description}
                        tabIndex={open ? 0 : -1}
                      >
                        <i className={`ms-Icon ms-Icon--${locked ? "Lock" : route.iconName}`} aria-hidden="true" />
                        <span style={{ whiteSpace: "nowrap" }}>{route.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div style={AppStyles.footer}>
        <span style={{ whiteSpace: "nowrap" }}>
          {appName} · {AppContent.footer.version} {APP_VERSION}
        </span>
      </div>
    </div>
    </nav>
  );
};
