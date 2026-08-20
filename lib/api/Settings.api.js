import { createStore, useStore } from "../core/state/Store";
import { configureThrottle } from "./Throttle.api";
const DEFAULTS = {
    appName: "Site Audit",
    appTagline: "Site audit tooling",
    reportLibrary: "",
    reportFolder: "",
    sites: [],
    concurrency: 4,
    defaultRoute: "dashboard",
    captureReportLogs: true,
    disabledModules: [],
};
export const settingsStore = createStore(DEFAULTS);
let host = { url: "", title: "" };
let hostDefaults = {};
let writer;
export function registerSettingsWriter(next) {
    writer = next;
}
export function canPersistSettings() {
    return writer !== undefined;
}
/**
 * `defaults` are the host's opinion: they fill in anything the stored settings do
 * not say, so a solution can ship a ready configured app without hard coding it.
 */
export function initSettings(json, hostSite, defaults = {}) {
    host = hostSite;
    hostDefaults = defaults;
    const settings = fromFile(Object.assign(Object.assign({}, defaults), stripEmpty(parse(json))), hostSite);
    settingsStore.setState(settings);
    configureThrottle({ concurrency: settings.concurrency });
    return settings;
}
export function saveSettings(next) {
    const settings = fromFile(Object.assign(Object.assign({}, hostDefaults), toFile(next)), host);
    settingsStore.setState(settings);
    configureThrottle({ concurrency: settings.concurrency });
    if (writer)
        writer(JSON.stringify(toFile(settings), null, 2));
}
export function getSettings() {
    return settingsStore.getState();
}
export function settingsJson() {
    return JSON.stringify(toFile(settingsStore.getState()), null, 2);
}
export function useSettings(selector) {
    return useStore(settingsStore, selector !== null && selector !== void 0 ? selector : ((settings) => settings));
}
/** Modules stay disabled until the report destination is set. */
export function checkConfig(settings = getSettings()) {
    const missing = [];
    if (!settings.reportLibrary.trim())
        missing.push("Report library");
    if (!settings.reportFolder.trim())
        missing.push("Report folder");
    if (settings.sites.length === 0)
        missing.push("Sites in scope");
    return { configured: missing.length === 0, missing };
}
export function useConfigCheck() {
    return checkConfig(useSettings());
}
export function parseSiteList(raw) {
    return raw
        .split(/[\n,;]+/)
        .map((value) => value.trim().replace(/\/$/, ""))
        .filter((value) => /^https?:\/\//i.test(value))
        .map((url) => { var _a; return ({ url, title: (_a = url.split("/").pop()) !== null && _a !== void 0 ? _a : url }); });
}
function parse(json) {
    if (!json || json.trim().length === 0)
        return { version: 1 };
    try {
        return JSON.parse(json);
    }
    catch (_a) {
        return { version: 1 };
    }
}
/** An absent value defers to the host default; an empty string is still a value. */
function stripEmpty(file) {
    const kept = {};
    Object.keys(file).forEach((key) => {
        const value = file[key];
        if (value !== undefined && value !== null)
            kept[key] = value;
    });
    return kept;
}
function fromFile(file, hostSite) {
    var _a, _b, _c, _d;
    const extra = ((_a = file.additionalSites) !== null && _a !== void 0 ? _a : []).filter((site) => site.url.replace(/\/$/, "").toLowerCase() !== hostSite.url.replace(/\/$/, "").toLowerCase());
    return {
        appName: text(file.appName, DEFAULTS.appName),
        appTagline: text(file.appTagline, DEFAULTS.appTagline),
        reportLibrary: text(file.reportLibrary, ""),
        reportFolder: text(file.reportFolder, ""),
        sites: hostSite.url ? [hostSite, ...extra] : extra,
        concurrency: clamp((_b = file.concurrency) !== null && _b !== void 0 ? _b : DEFAULTS.concurrency, 1, 12),
        defaultRoute: text(file.defaultRoute, DEFAULTS.defaultRoute),
        captureReportLogs: (_c = file.captureReportLogs) !== null && _c !== void 0 ? _c : DEFAULTS.captureReportLogs,
        disabledModules: ((_d = file.disabledModules) !== null && _d !== void 0 ? _d : []).filter((key) => typeof key === "string"),
    };
}
function toFile(settings) {
    return {
        version: 1,
        appName: settings.appName,
        appTagline: settings.appTagline,
        reportLibrary: settings.reportLibrary,
        reportFolder: settings.reportFolder,
        additionalSites: settings.sites.slice(1),
        concurrency: settings.concurrency,
        defaultRoute: settings.defaultRoute,
        captureReportLogs: settings.captureReportLogs,
        disabledModules: settings.disabledModules,
    };
}
function text(value, fallback) {
    return value && value.trim().length > 0 ? value.trim() : fallback;
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
//# sourceMappingURL=Settings.api.js.map