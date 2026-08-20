export interface SiteTarget {
  url: string;
  title: string;
}

/**
 * Column names vary between tenants, so the audits ask the settings rather than
 * guessing. Empty means "this site does not have one", not "use a default".
 */
export interface FieldMapping {
  organisationalUnit: string;
  /** List holding the organisational units, when the column looks them up. */
  organisationalUnitList: string;
  expiryDate: string;
  reviewDate: string;
  publishDate: string;
  /** Rich text columns to read for the content, images and link audits. */
  htmlFields: string[];
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
  fields: FieldMapping;
  /** Hosts that have been retired. Every link to one is dead by definition. */
  legacyUrls: string[];
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
  fields?: Partial<FieldMapping>;
  legacyUrls?: string[];
}

export type SettingsWriter = (json: string) => void;

export interface ConfigCheck {
  configured: boolean;
  missing: string[];
}
