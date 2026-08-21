import { createStore, useStore } from "@/core/state/Store";
import { enqueue, registerTaskRunner, getTask } from "@/core/queue/Queue.store";
import { SubProgress, TaskStatus } from "@/core/queue/Queue.types";
import { ReportEnvelope, StageStatus } from "@/api/Reports.types";
import { Reports } from "@/api/Reports.api";
import { getContext } from "@/api/Sp.api";
import { getSettings } from "@/api/Settings.api";
import { readLocal, writeLocal } from "@/utils/Storage.util";
import { AppSettings } from "@/api/Settings.types";
import { ReportDefinition } from "@/core/report/Report.types";
import { runReport } from "@/core/report/Report.engine";

export interface ReportRunState {
  kind: string;
  taskId?: string;
  envelope?: ReportEnvelope;
  savedUrl?: string;
}

export interface StartReportInput<TData, TConfig> {
  sites?: string[];
  config?: TConfig;
  resumeFrom?: ReportEnvelope<TData, TConfig>;
}

interface ReportPayload<TData, TConfig> {
  sites: string[];
  config: TConfig;
  resumeFrom?: ReportEnvelope<TData, TConfig>;
}

export const reportStore = createStore<Record<string, ReportRunState>>({});

const definitions = new Map<string, ReportDefinition<unknown, unknown>>();
const hostConfigDefaults = new Map<string, Record<string, unknown>>();

/**
 * Config a host wants a report to start with, keyed by report kind. Merged over the
 * report's own defaults, so a solution can raise a limit or switch a stage on
 * without touching the module.
 */
export function setReportDefaults(defaults: Record<string, Record<string, unknown>> | undefined): void {
  hostConfigDefaults.clear();
  Object.keys(defaults ?? {}).forEach((kind) => hostConfigDefaults.set(kind, (defaults ?? {})[kind]));
}

/**
 * What a report starts with: its own defaults, then the host's, then the column
 * mapping the site itself has filled in, which is the most specific of the three.
 */
export function reportConfig<TConfig>(definition: ReportDefinition<unknown, TConfig>): TConfig {
  return {
    ...definition.defaultConfig,
    ...(hostConfigDefaults.get(definition.kind) ?? {}),
    ...mappedConfig(definition.kind, getSettings()),
    // Whatever this person last chose to keep wins: it is the most deliberate of the four.
    ...readLocal<Record<string, unknown>>(configKey(definition.kind), {}),
  } as TConfig;
}

export function saveReportConfig<TConfig>(kind: string, config: TConfig): void {
  writeLocal(configKey(kind), config as unknown as Record<string, unknown>);
}

export function clearReportConfig(kind: string): void {
  writeLocal(configKey(kind), {});
}

function configKey(kind: string): string {
  return `report-config:${kind}`;
}

/** Settings the site owner filled in that a report would otherwise have to guess. */
function mappedConfig(kind: string, settings: AppSettings): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  const columns = settings.fields.htmlFields.join(",");
  const dates = [settings.fields.reviewDate, settings.fields.expiryDate, settings.fields.publishDate]
    .filter((column) => column.trim().length > 0)
    .join(",");

  if (columns && ["content-audit", "images-audit", "link-audit"].indexOf(kind) !== -1) {
    config.columnNames = columns;
  }

  if (kind === "publishing-audit" && dates) config.dateColumns = dates;
  if (kind === "link-audit" && settings.legacyUrls.length > 0) config.legacyHosts = settings.legacyUrls.join(",");

  return config;
}

export function getReportDefinition(kind: string): ReportDefinition<unknown, unknown> | undefined {
  return definitions.get(kind);
}

export function resumeSavedEnvelope(envelope: ReportEnvelope): string | undefined {
  const definition = definitions.get(envelope.kind);
  if (!definition) return undefined;
  return startReport(definition, { resumeFrom: envelope, sites: envelope.sites, config: envelope.config });
}

export function taskKind(kind: string): string {
  return `report:${kind}`;
}

export function registerReport<TData, TConfig>(definition: ReportDefinition<TData, TConfig>): void {
  definitions.set(definition.kind, definition as ReportDefinition<unknown, unknown>);

  registerTaskRunner<ReportPayload<TData, TConfig>, ReportEnvelope<TData, TConfig>>(
    taskKind(definition.kind),
    async (payload, controls) => {
      const store = Reports();

      const result = await runReport(definition, {
        sites: payload.sites,
        config: payload.config,
        resumeFrom: payload.resumeFrom,
        createdBy: getContext().pageContext.user.displayName,
        createdByLogin: getContext().pageContext.user.loginName,
        isCancelled: controls.isCancelled,
        isPaused: controls.isPaused,
        captureLogs: getSettings().captureReportLogs,
        onUpdate: (envelope) => {
          patch(definition.kind, { envelope: envelope as ReportEnvelope });
          controls.report({
            ratio: completion(envelope),
            message: activeLabel(envelope),
            children: envelope.stages.map(toChild),
          });
          // A pause is held by the queue, not the envelope, so a progress update
          // published mid stage must not report the run as running again.
          controls.setStatus(controls.isPaused() ? "paused" : taskStatus(envelope));
        },
        persist: async (envelope) => {
          const summary = await store.save(envelope);
          patch(definition.kind, { savedUrl: summary.serverRelativeUrl });
        },
      });

      return result.envelope;
    }
  );
}

export function startReport<TData, TConfig>(
  definition: ReportDefinition<TData, TConfig>,
  input: StartReportInput<TData, TConfig> = {}
): string {
  const sites = input.sites ?? getSettings().sites.map((site) => site.url);
  const config = input.config ?? input.resumeFrom?.config ?? reportConfig(definition as ReportDefinition<unknown, TConfig>);

  const taskId = enqueue<ReportPayload<TData, TConfig>>({
    kind: taskKind(definition.kind),
    label: definition.title,
    payload: { sites, config, resumeFrom: input.resumeFrom },
  });

  patch(definition.kind, {
    kind: definition.kind,
    taskId,
    envelope: input.resumeFrom as ReportEnvelope | undefined,
  });

  return taskId;
}

export function openEnvelope(envelope: ReportEnvelope): void {
  patch(envelope.kind, { envelope, taskId: undefined });
}

export function clearRun(kind: string): void {
  patch(kind, { envelope: undefined, taskId: undefined, savedUrl: undefined });
}

export function useReportRun(kind: string): ReportRunState & { taskStatus?: TaskStatus } {
  const state = useStore(reportStore, (all) => all[kind]);
  const task = state?.taskId ? getTask(state.taskId) : undefined;
  return { ...(state ?? {}), kind, taskStatus: task?.status };
}

function patch(kind: string, changes: Partial<ReportRunState>): void {
  reportStore.setState((state) => ({
    ...state,
    [kind]: { ...(state[kind] ?? {}), ...changes, kind },
  }));
}

function completion<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>): number {
  const done = envelope.stages.filter(
    (stage) => stage.status === "succeeded" || stage.status === "skipped"
  ).length;
  return envelope.stages.length === 0 ? 0 : done / envelope.stages.length;
}

function activeLabel<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>): string {
  const active = envelope.stages.find((stage) => stage.status === "running");
  if (!active) return envelope.status;
  return active.total ? `${active.label} ${active.processed}/${active.total}` : active.label;
}

function toChild(stage: {
  key: string;
  label: string;
  status: StageStatus;
  processed: number;
  total?: number;
  error?: string;
}): SubProgress {
  return {
    key: stage.key,
    label: stage.label,
    status: stage.status as TaskStatus,
    ratio: stage.total ? stage.processed / stage.total : undefined,
    message: stage.error,
  };
}

function taskStatus<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>): TaskStatus {
  // The envelope knows it has finished before the runner returns, and the queue has
  // to hear it: otherwise the last publish leaves the task looking like it is running.
  if (envelope.status === "complete") return "succeeded";
  if (envelope.status === "cancelled") return "cancelled";
  if (envelope.status === "paused") return "paused";
  if (envelope.status === "failed") return "failed";
  return "running";
}
