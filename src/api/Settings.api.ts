import { createStore, useStore } from "@/core/state/Store";
import { configureThrottle } from "@/api/Throttle.api";
import { AppSettings, ConfigCheck, SettingsFile, SettingsWriter, SiteTarget } from "@/api/Settings.types";

const DEFAULTS: AppSettings = {
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

export const settingsStore = createStore<AppSettings>(DEFAULTS);

let host: SiteTarget = { url: "", title: "" };
let hostDefaults: Partial<SettingsFile> = {};
let writer: SettingsWriter | undefined;

export function registerSettingsWriter(next: SettingsWriter | undefined): void {
  writer = next;
}

export function canPersistSettings(): boolean {
  return writer !== undefined;
}

/**
 * `defaults` are the host's opinion: they fill in anything the stored settings do
 * not say, so a solution can ship a ready configured app without hard coding it.
 */
export function initSettings(
  json: string | undefined,
  hostSite: SiteTarget,
  defaults: Partial<SettingsFile> = {}
): AppSettings {
  host = hostSite;
  hostDefaults = defaults;
  const settings = fromFile({ ...defaults, ...stripEmpty(parse(json)) }, hostSite);
  settingsStore.setState(settings);
  configureThrottle({ concurrency: settings.concurrency });
  return settings;
}

export function saveSettings(next: AppSettings): void {
  const settings = fromFile({ ...hostDefaults, ...toFile(next) }, host);
  settingsStore.setState(settings);
  configureThrottle({ concurrency: settings.concurrency });
  if (writer) writer(JSON.stringify(toFile(settings), null, 2));
}

export function getSettings(): AppSettings {
  return settingsStore.getState();
}

export function settingsJson(): string {
  return JSON.stringify(toFile(settingsStore.getState()), null, 2);
}

export function useSettings(): AppSettings;
export function useSettings<TSlice>(selector: (settings: AppSettings) => TSlice): TSlice;
export function useSettings<TSlice>(selector?: (settings: AppSettings) => TSlice): TSlice | AppSettings {
  return useStore(settingsStore, selector ?? ((settings) => settings as unknown as TSlice));
}

/** Modules stay disabled until the report destination is set. */
export function checkConfig(settings: AppSettings = getSettings()): ConfigCheck {
  const missing: string[] = [];
  if (!settings.reportLibrary.trim()) missing.push("Report library");
  if (!settings.reportFolder.trim()) missing.push("Report folder");
  if (settings.sites.length === 0) missing.push("Sites in scope");
  return { configured: missing.length === 0, missing };
}

export function useConfigCheck(): ConfigCheck {
  return checkConfig(useSettings());
}

export function parseSiteList(raw: string): SiteTarget[] {
  return raw
    .split(/[\n,;]+/)
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter((value) => /^https?:\/\//i.test(value))
    .map((url) => ({ url, title: url.split("/").pop() ?? url }));
}

function parse(json: string | undefined): SettingsFile {
  if (!json || json.trim().length === 0) return { version: 1 };
  try {
    return JSON.parse(json) as SettingsFile;
  } catch {
    return { version: 1 };
  }
}

/** An absent value defers to the host default; an empty string is still a value. */
function stripEmpty(file: SettingsFile): SettingsFile {
  const kept: Record<string, unknown> = {};

  Object.keys(file).forEach((key) => {
    const value = (file as unknown as Record<string, unknown>)[key];
    if (value !== undefined && value !== null) kept[key] = value;
  });

  return kept as unknown as SettingsFile;
}

function fromFile(file: SettingsFile, hostSite: SiteTarget): AppSettings {
  const extra = (file.additionalSites ?? []).filter(
    (site) => site.url.replace(/\/$/, "").toLowerCase() !== hostSite.url.replace(/\/$/, "").toLowerCase()
  );

  return {
    appName: text(file.appName, DEFAULTS.appName),
    appTagline: text(file.appTagline, DEFAULTS.appTagline),
    reportLibrary: text(file.reportLibrary, ""),
    reportFolder: text(file.reportFolder, ""),
    sites: hostSite.url ? [hostSite, ...extra] : extra,
    concurrency: clamp(file.concurrency ?? DEFAULTS.concurrency, 1, 12),
    defaultRoute: text(file.defaultRoute, DEFAULTS.defaultRoute),
    captureReportLogs: file.captureReportLogs ?? DEFAULTS.captureReportLogs,
    disabledModules: (file.disabledModules ?? []).filter((key) => typeof key === "string"),
  };
}

function toFile(settings: AppSettings): SettingsFile {
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

function text(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
