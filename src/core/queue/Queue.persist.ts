import { queueStore } from "@/core/queue/Queue.store";
import { QueueTask } from "@/core/queue/Queue.types";
import { readLocal, writeLocal } from "@/utils/Storage.util";

const KEY = "queue";
const MAX_TASKS = 40;

/**
 * The queue lives in the browser, so a reload would otherwise lose every record
 * of what was running. Reports themselves checkpoint to the report library.
 */
let subscribed = false;

export function restoreQueue(): void {
  const saved = readLocal<QueueTask[]>(KEY, []);

  const tasks = saved.map((task) =>
    task.status === "running" || task.status === "queued" || task.status === "throttled" || task.status === "waiting"
      ? { ...task, status: "paused" as const, resumable: true, error: task.error ?? INTERRUPTED }
      : task
  );

  if (tasks.length > 0) queueStore.setState((state) => ({ ...state, tasks }));

  if (subscribed) return;
  subscribed = true;

  queueStore.subscribe((state) =>
    writeLocal(
      KEY,
      state.tasks.slice(-MAX_TASKS).map((task) => ({ ...task, result: undefined }))
    )
  );
}

export const INTERRUPTED = "The page was closed or reloaded before this task finished.";
