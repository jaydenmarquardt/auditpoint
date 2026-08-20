export type ReportRunStatus = "pending" | "running" | "paused" | "cancelled" | "complete" | "failed";

export type StageStatus =
  | "pending"
  | "waiting"
  | "running"
  | "throttled"
  | "paused"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "skipped";

export interface ReportStageState {
  key: string;
  label: string;
  status: StageStatus;
  processed: number;
  total?: number;
  startedIso?: string;
  finishedIso?: string;
  error?: string;
  /** Opaque resume marker written by the stage itself. */
  cursor?: unknown;
}

export interface ReportIssue {
  iso: string;
  stage: string;
  target: string;
  code: number | "error";
  message: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ReportLogEntry {
  iso: string;
  stage: string;
  level: LogLevel;
  message: string;
}

export interface ReportEnvelope<TData = Record<string, unknown>, TConfig = Record<string, unknown>> {
  id: string;
  kind: string;
  title: string;
  /** Module/report version that produced this envelope. */
  version: string;
  schemaVersion: number;
  config: TConfig;
  createdIso: string;
  updatedIso: string;
  createdBy: string;
  createdByLogin?: string;
  sites: string[];
  status: ReportRunStatus;
  stages: ReportStageState[];
  issues: ReportIssue[];
  logs: ReportLogEntry[];
  data: Partial<TData>;
}

export interface ReportIndexEntry {
  id: string;
  kind: string;
  title: string;
  version: string;
  status: ReportRunStatus;
  createdIso: string;
  updatedIso: string;
  createdBy: string;
  createdByLogin: string;
  sites: string[];
  issues: number;
  stages: { key: string; label: string; status: string }[];
  fileName: string;
}

export interface ReportSummary {
  id: string;
  name: string;
  kind: string;
  title: string;
  status: ReportRunStatus;
  serverRelativeUrl: string;
  modified: string;
  sizeBytes: number;
  createdBy: string;
  createdByLogin: string;
}

export interface ReportFolderAccess {
  url: string;
  exists: boolean;
  canView: boolean;
  canEdit: boolean;
  error?: string;
}

export interface ReportLocation {
  library: string;
  folder: string;
  webUrl?: string;
}
