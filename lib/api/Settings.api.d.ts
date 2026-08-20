import { AppSettings, ConfigCheck, SettingsWriter, SiteTarget } from "./Settings.types";
export declare const settingsStore: import("../core/state/Store").Store<AppSettings>;
export declare function registerSettingsWriter(next: SettingsWriter | undefined): void;
export declare function canPersistSettings(): boolean;
export declare function initSettings(json: string | undefined, hostSite: SiteTarget): AppSettings;
export declare function saveSettings(next: AppSettings): void;
export declare function getSettings(): AppSettings;
export declare function settingsJson(): string;
export declare function useSettings(): AppSettings;
export declare function useSettings<TSlice>(selector: (settings: AppSettings) => TSlice): TSlice;
/** Modules stay disabled until the report destination is set. */
export declare function checkConfig(settings?: AppSettings): ConfigCheck;
export declare function useConfigCheck(): ConfigCheck;
export declare function parseSiteList(raw: string): SiteTarget[];
//# sourceMappingURL=Settings.api.d.ts.map