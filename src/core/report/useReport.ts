import { useCallback, useState } from "react";
import { cancelTask, getTask, isTaskLive, pauseTask, removeTask, resumeTask } from "@/core/queue/Queue.store";
import { TaskStatus } from "@/core/queue/Queue.types";
import { ReportEnvelope } from "@/api/Reports.types";
import { Reports } from "@/api/Reports.api";
import { ReportDefinition } from "@/core/report/Report.types";
import { clearRun, openEnvelope, startReport, useReportRun } from "@/core/report/Report.store";
import { toErrorMessage } from "@/utils/Guard.util";

const MISSING_REPORT = "That report could not be opened. It may have been deleted or you may not have access.";

export interface ReportController<TData, TConfig = Record<string, unknown>> {
  envelope?: ReportEnvelope<TData, TConfig>;
  config: TConfig;
  setConfig(config: TConfig): void;
  status: TaskStatus | "idle";
  running: boolean;
  paused: boolean;
  savedUrl?: string;
  /** Last failure from opening or resuming a saved run, for the page to surface. */
  error?: string;
  clearError(): void;
  start(sites?: string[]): void;
  resume(): void;
  pause(): void;
  cancel(): void;
  open(serverRelativeUrl: string): Promise<void>;
  /** Loads a previously exported run from a file, without touching the library. */
  importJson(file: File): Promise<void>;
  resumeSaved(serverRelativeUrl: string): Promise<void>;
  clear(): void;
}

export function useReport<TData, TConfig>(
  definition: ReportDefinition<TData, TConfig>
): ReportController<TData, TConfig> {
  const run = useReportRun(definition.kind);
  const status = run.taskStatus ?? "idle";
  const envelope = run.envelope as ReportEnvelope<TData, TConfig> | undefined;
  const [config, setConfig] = useState<TConfig>(definition.defaultConfig);
  const [error, setError] = useState<string | undefined>(undefined);

  const start = useCallback(
    (sites?: string[]) => {
      startReport(definition, { sites, config });
    },
    [definition, config]
  );

  const resume = useCallback(() => {
    const task = run.taskId ? getTask(run.taskId) : undefined;
    // A run interrupted by a reload keeps its paused task but has no runner behind it,
    // so it restarts from the checkpointed envelope instead.
    if (task?.status === "paused" && isTaskLive(task.id) && resumeTask(task.id)) return;
    if (task && !isTaskLive(task.id)) cancelTask(task.id);
    if (envelope) startReport(definition, { resumeFrom: envelope, sites: envelope.sites, config });
  }, [definition, envelope, run.taskId, config]);

  const pause = useCallback(() => {
    if (run.taskId) pauseTask(run.taskId);
  }, [run.taskId]);

  /**
   * Cancelling ends the run rather than parking it: the task is dropped, the partial
   * checkpoint is deleted, and the page falls back to the list of previous runs.
   */
  const cancel = useCallback(() => {
    if (run.taskId) {
      cancelTask(run.taskId);
      removeTask(run.taskId);
    }

    const savedUrl = run.savedUrl;
    if (savedUrl) {
      Reports()
        .remove(savedUrl)
        .catch(() => undefined);
    }

    clearRun(definition.kind);
  }, [definition.kind, run.taskId, run.savedUrl]);

  const open = useCallback(async (serverRelativeUrl: string) => {
    setError(undefined);

    try {
      const saved = await Reports().read<TData, TConfig>(serverRelativeUrl);
      openEnvelope(saved as ReportEnvelope);
    } catch (failure) {
      // A run deleted since the list was drawn is the common case, so say so rather
      // than leaving a button that appears to do nothing.
      setError(`${MISSING_REPORT} ${toErrorMessage(failure)}`);
    }
  }, []);

  const importJson = useCallback(
    async (file: File) => {
      setError(undefined);

      try {
        const parsed = JSON.parse(await file.text()) as ReportEnvelope<TData, TConfig>;
        if (!parsed?.kind || !Array.isArray(parsed.stages)) throw new Error("That file is not a saved run.");
        if (parsed.kind !== definition.kind) throw new Error(`That file holds a ${parsed.kind} run.`);

        openEnvelope(parsed as ReportEnvelope);
      } catch (failure) {
        setError(toErrorMessage(failure));
      }
    },
    [definition.kind]
  );

  const resumeSaved = useCallback(
    async (serverRelativeUrl: string) => {
      setError(undefined);

      try {
        const saved = await Reports().read<TData, TConfig>(serverRelativeUrl);
        startReport(definition, { resumeFrom: saved, sites: saved.sites, config: saved.config });
      } catch (failure) {
        setError(`${MISSING_REPORT} ${toErrorMessage(failure)}`);
      }
    },
    [definition]
  );

  return {
    envelope,
    config,
    setConfig,
    status,
    running: status === "running" || status === "throttled" || status === "queued",
    paused: status === "paused",
    savedUrl: run.savedUrl,
    error,
    clearError: useCallback(() => setError(undefined), []),
    start,
    resume,
    pause,
    cancel,
    open,
    importJson,
    resumeSaved,
    clear: useCallback(() => clearRun(definition.kind), [definition.kind]),
  };
}
