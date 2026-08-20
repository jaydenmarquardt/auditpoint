export interface SiteTarget {
    url: string;
    title: string;
}
export interface AppSettings {
    appName: string;
    appTagline: string;
    reportLibrary: string;
    reportFolder: string;
    /** Host site is always index 0 and cannot be removed. */
    sites: SiteTarget[];
    concurrency: number;
    defaultRoute: string;
    captureReportLogs: boolean;
    /** Module keys switched off in the app. The host can rule more out in code. */
    disabledModules: string[];
}
export interface SettingsFile {
    version: number;
    appName?: string;
    appTagline?: string;
    reportLibrary?: string;
    reportFolder?: string;
    additionalSites?: SiteTarget[];
    concurrency?: number;
    defaultRoute?: string;
    captureReportLogs?: boolean;
    disabledModules?: string[];
}
export type SettingsWriter = (json: string) => void;
export interface ConfigCheck {
    configured: boolean;
    missing: string[];
}
//# sourceMappingURL=Settings.types.d.ts.map