import { queueStore } from "@/core/queue/Queue.store";
import { QueueTask } from "@/core/queue/Queue.types";
import { readLocal, writeLocal } from "@/utils/Storage.util";

const KEY = "queue";
const MAX_TASKS = 40;
const PERSIST_EVERY_MS = 2000;

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

  let pending: number | undefined;

  queueStore.subscribe((state) => {
    // Serialising the whole queue on every progress update was costing more than the
    // work it was recording, so writes are coalesced and the child progress dropped.
    if (pending !== undefined) return;

    pending = window.setTimeout(() => {
      pending = undefined;

      writeLocal(
        KEY,
        state.tasks.slice(-MAX_TASKS).map((task) => ({
          ...task,
          result: undefined,
          progress: { ...task.progress, children: undefined },
        }))
      );
    }, PERSIST_EVERY_MS);
  });
}

export const INTERRUPTED = "The page was closed or reloaded before this task finished.";
