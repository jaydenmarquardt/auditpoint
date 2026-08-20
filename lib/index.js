import { setupSp } from "./api/Sp.api";
import { initSettings, registerSettingsWriter } from "./api/Settings.api";
import { appStore } from "./core/state/App.store";
export { App as AuditPointApp, default as AuditPoint } from "./app/App";
export { AuditPointBaseWebPart, modulePropertyKey, default as AuditPointWebPartBase, } from "./webparts/AuditPointBaseWebPart";
export { setupSp } from "./api/Sp.api";
export { canPersistSettings, getSettings, initSettings, registerSettingsWriter, saveSettings, settingsJson, useSettings, } from "./api/Settings.api";
export { appStore, navigate } from "./core/state/App.store";
export { MODULES, enabledModules, findModule, hostModules, isModuleEnabled, offeredModules, setHostModules, } from "./modules/Modules.registry";
export { APP_VERSION } from "./version";
/**
 * Wires PnP, settings and the default route. Call once from the host's `onInit`,
 * and again whenever the stored settings change, before rendering the app.
 */
export function configureAuditPoint(setup) {
    setupSp(setup.context);
    registerSettingsWriter(setup.onSettingsChange);
    const settings = initSettings(setup.settingsJson, {
        url: setup.context.pageContext.web.absoluteUrl,
        title: setup.context.pageContext.web.title,
    });
    appStore.setState((state) => (Object.assign(Object.assign({}, state), { route: settings.defaultRoute || state.route })));
    return settings;
}
/** Drops the settings writer, so a disposed host stops being written to. */
export function disposeAuditPoint() {
    registerSettingsWriter(undefined);
}
//# sourceMappingURL=index.js.map