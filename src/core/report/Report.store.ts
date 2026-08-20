import { createStore, useStore } from "@/core/state/Store";
import { enqueue, registerTaskRunner, getTask } from "@/core/queue/Queue.store";
import { SubProgress, TaskStatus } from "@/core/queue/Queue.types";
import { ReportEnvelope, StageStatus } from "@/api/Reports.types";
import { Reports } from "@/api/Reports.api";
import { getContext } from "@/api/Sp.api";
import { getSettings } from "@/api/Settings.api";
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
  const config = input.config ?? input.resumeFrom?.config ?? definition.defaultConfig;

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
  if (envelope.status === "cancelled") return "cancelled";
  if (envelope.status === "paused") return "paused";
  if (envelope.status === "failed") return "failed";
  return "running";
}
