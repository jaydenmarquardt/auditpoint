import { LogLevel, ReportEnvelope, ReportIssue, ReportStageState } from "@/api/Reports.types";
import { createId } from "@/utils/Id.util";
import { toErrorMessage } from "@/utils/Guard.util";
import { ReportDefinition, RunOptions, RunResult, StageContext } from "@/core/report/Report.types";

export function createEnvelope<TData, TConfig>(
  definition: ReportDefinition<TData, TConfig>,
  sites: string[],
  config: TConfig,
  createdBy: string,
  createdByLogin: string
): ReportEnvelope<TData, TConfig> {
  const iso = new Date().toISOString();

  return {
    id: createId("rpt").replace(/^rpt-/, ""),
    kind: definition.kind,
    title: definition.title,
    version: definition.version,
    schemaVersion: definition.schemaVersion,
    config,
    createdIso: iso,
    updatedIso: iso,
    createdBy,
    createdByLogin,
    sites,
    status: "pending",
    stages: definition.stages.map((stage) => ({
      key: stage.key,
      label: stage.label,
      status: "pending",
      processed: 0,
    })),
    issues: [],
    logs: [],
    data: {},
  };
}

/** Checkpoints after each stage; a resume skips succeeded stages and restores the cursor. */
export async function runReport<TData, TConfig>(
  definition: ReportDefinition<TData, TConfig>,
  options: RunOptions<TData, TConfig>
): Promise<RunResult<TData, TConfig>> {
  const envelope: ReportEnvelope<TData, TConfig> =
    options.resumeFrom ??
    createEnvelope(definition, options.sites, options.config, options.createdBy, options.createdByLogin);

  envelope.status = "running";
  envelope.logs = envelope.logs ?? [];
  envelope.sites = options.sites;
  envelope.config = options.config;
  envelope.version = definition.version;
  syncStages(definition, envelope);
  publish(envelope, options);

  for (const stage of definition.stages) {
    const state = stageState(envelope, stage.key);
    if (state.status === "succeeded" || state.status === "skipped") continue;

    if (options.isCancelled()) return cancelRun(envelope, state, options);

    while (options.isPaused()) {
      state.status = "paused";
      publish(envelope, options);
      await wait(500);
      if (options.isCancelled()) return cancelRun(envelope, state, options);
    }

    state.status = "running";
    state.startedIso = new Date().toISOString();
    addLog(envelope, options, stage.key, "info", `Stage started for ${options.sites.length} site(s)`);
    state.error = undefined;
    publish(envelope, options);

    try {
      for (const siteUrl of options.sites) {
        await stage.run(buildContext(envelope, state, siteUrl, options));
        // A stage returns early on cancel, so the run stops here rather than
        // recording a stage that never finished as succeeded.
        if (options.isCancelled()) return cancelRun(envelope, state, options);
      }

      state.status = "succeeded";
      state.finishedIso = new Date().toISOString();
      addLog(envelope, options, stage.key, "info", `Stage finished, ${state.processed} processed`);
      await checkpoint(envelope, options);
    } catch (error) {
      state.status = "failed";
      state.error = toErrorMessage(error);
      state.finishedIso = new Date().toISOString();
      envelope.status = "failed";
      addLog(envelope, options, stage.key, "error", state.error ?? "Stage failed");
      addIssue(envelope, {
        stage: stage.key,
        target: options.sites[0] ?? "",
        code: statusOf(error) ?? "error",
        message: state.error,
      });
      await checkpoint(envelope, options);
      return { envelope, stages: envelope.stages };
    }
  }

  envelope.status = "complete";
  await checkpoint(envelope, options);
  return { envelope, stages: envelope.stages };
}

/**
 * A cancelled run is thrown away rather than checkpointed: the caller drops it and
 * deletes any partial file, so saving here would only leave a run nobody can use.
 */
function cancelRun<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  state: ReportStageState,
  options: RunOptions<TData, TConfig>
): RunResult<TData, TConfig> {
  state.status = "cancelled";
  state.finishedIso = new Date().toISOString();
  envelope.status = "cancelled";
  publish(envelope, options);
  return { envelope, stages: envelope.stages };
}

function buildContext<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  state: ReportStageState,
  siteUrl: string,
  options: RunOptions<TData, TConfig>
): StageContext<TData, TConfig> {
  return {
    siteUrl,
    config: options.config,
    data: envelope.data,
    cursor: state.cursor,
    progress: (processed, total) => {
      state.processed = processed;
      state.total = total ?? state.total;
      publish(envelope, options, true);
    },
    setCursor: (cursor) => {
      state.cursor = cursor;
    },
    issue: (issue) => {
      addIssue(envelope, { ...issue, stage: state.key });
      addLog(envelope, options, state.key, "warn", `${issue.target}: ${issue.message}`);
      publish(envelope, options);
    },
    log: (message, level = "info") => {
      addLog(envelope, options, state.key, level, message);
      publish(envelope, options);
    },
    isCancelled: options.isCancelled,
    waitIfPaused: async () => {
      while (options.isPaused() && !options.isCancelled()) {
        if (state.status !== "paused") {
          state.status = "paused";
          publish(envelope, options);
        }
        await wait(400);
      }

      if (state.status === "paused" && !options.isCancelled()) {
        state.status = "running";
        publish(envelope, options);
      }
    },
  };
}

function syncStages<TData, TConfig>(
  definition: ReportDefinition<TData, TConfig>,
  envelope: ReportEnvelope<TData, TConfig>
): void {
  envelope.stages = definition.stages.map((stage) => {
    const existing = envelope.stages.find((candidate) => candidate.key === stage.key);
    return existing ?? { key: stage.key, label: stage.label, status: "pending", processed: 0 };
  });
}

function stageState<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>, key: string): ReportStageState {
  const found = envelope.stages.find((stage) => stage.key === key);
  if (!found) throw new Error(`Unknown stage "${key}".`);
  return found;
}

function addIssue<TData, TConfig>(envelope: ReportEnvelope<TData, TConfig>, issue: Omit<ReportIssue, "iso">): void {
  envelope.issues.push({ ...issue, iso: new Date().toISOString() });
}

const MAX_LOGS = 500;

function addLog<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  options: RunOptions<TData, TConfig>,
  stage: string,
  level: LogLevel,
  message: string
): void {
  if (!options.captureLogs) return;

  envelope.logs = [...(envelope.logs ?? []), { iso: new Date().toISOString(), stage, level, message }].slice(
    -MAX_LOGS
  );
}

/**
 * A stage reports progress per item, which on a long run is thousands of updates a
 * minute. Every one of them re-rendered the page and rebuilt its view, so progress
 * is published on a timer and `updatedIso` only moves when something real happened:
 * the pages that derive from the run key their memos off it.
 */
const PUBLISH_EVERY_MS = 400;
let lastPublish = 0;

function publish<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  options: RunOptions<TData, TConfig>,
  progressOnly = false
): void {
  const now = Date.now();
  if (progressOnly && now - lastPublish < PUBLISH_EVERY_MS) return;

  lastPublish = now;
  if (!progressOnly) envelope.updatedIso = new Date().toISOString();

  options.onUpdate({ ...envelope, stages: [...envelope.stages], issues: [...envelope.issues] });
}

async function checkpoint<TData, TConfig>(
  envelope: ReportEnvelope<TData, TConfig>,
  options: RunOptions<TData, TConfig>
): Promise<void> {
  publish(envelope, options);
  await options.persist(envelope);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
