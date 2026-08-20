/**
 * Public entry point when AuditPoint is consumed as a library rather than deployed
 * as its own solution. A host web part calls `configureAuditPoint` in `onInit` and
 * renders `AuditPointApp`; everything else here is for hosts that want to reach
 * further in.
 */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { setupSp } from "@/api/Sp.api";
import { initSettings, registerSettingsWriter } from "@/api/Settings.api";
import { appStore } from "@/core/state/App.store";
import { AppSettings } from "@/api/Settings.types";

export { App as AuditPointApp, default as AuditPoint } from "@/app/App";
export {
  AuditPointBaseWebPart,
  modulePropertyKey,
  default as AuditPointWebPartBase,
} from "@/webparts/AuditPointBaseWebPart";
export type { IAuditPointWebPartProps } from "@/webparts/AuditPointBaseWebPart";
export type { AppProps as AuditPointAppProps } from "@/app/App";
export { setupSp } from "@/api/Sp.api";
export {
  canPersistSettings,
  getSettings,
  initSettings,
  registerSettingsWriter,
  saveSettings,
  settingsJson,
  useSettings,
} from "@/api/Settings.api";
export type { AppSettings, SiteTarget } from "@/api/Settings.types";
export { appStore, navigate } from "@/core/state/App.store";
export {
  MODULES,
  enabledModules,
  findModule,
  hostModules,
  isModuleEnabled,
  offeredModules,
  setHostModules,
} from "@/modules/Modules.registry";
export type { Module, ModuleGroup } from "@/modules/Modules.types";
export { APP_VERSION } from "@/version";

export interface AuditPointSetup {
  context: WebPartContext;
  /** The host web part property holding the settings blob the app edits in place. */
  settingsJson?: string;
  /** Called when the app saves settings, so the host can persist them on itself. */
  onSettingsChange?: (json: string) => void;
}

/**
 * Wires PnP, settings and the default route. Call once from the host's `onInit`,
 * and again whenever the stored settings change, before rendering the app.
 */
export function configureAuditPoint(setup: AuditPointSetup): AppSettings {
  setupSp(setup.context);
  registerSettingsWriter(setup.onSettingsChange);

  const settings = initSettings(setup.settingsJson, {
    url: setup.context.pageContext.web.absoluteUrl,
    title: setup.context.pageContext.web.title,
  });

  appStore.setState((state) => ({ ...state, route: settings.defaultRoute || state.route }));
  return settings;
}

/** Drops the settings writer, so a disposed host stops being written to. */
export function disposeAuditPoint(): void {
  registerSettingsWriter(undefined);
}
