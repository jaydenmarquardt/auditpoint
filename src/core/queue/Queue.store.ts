import { createStore, useStore } from "@/core/state/Store";
import { createId } from "@/utils/Id.util";
import { toErrorMessage } from "@/utils/Guard.util";
import { QueueTask, TaskControls, TaskRunner, TaskStatus } from "@/core/queue/Queue.types";

export interface QueueState {
  tasks: QueueTask[];
  concurrency: number;
}

const runners = new Map<string, TaskRunner>();
const cancelled = new Set<string>();
const pausedTasks = new Set<string>();
/**
 * Tasks with a runner actually executing in this page session. A task restored from
 * a previous session has none, so nothing would ever act on a pause or a cancel.
 */
const live = new Set<string>();

export const queueStore = createStore<QueueState>({ tasks: [], concurrency: 1 });

export function registerTaskRunner<TPayload, TResult>(
  kind: string,
  runner: TaskRunner<TPayload, TResult>
): void {
  runners.set(kind, runner as TaskRunner);
}

export function setConcurrency(concurrency: number): void {
  queueStore.setState((state) => ({ ...state, concurrency: Math.max(1, concurrency) }));
  pump();
}

export function enqueue<TPayload>(input: { kind: string; label: string; payload: TPayload }): string {
  const task: QueueTask<TPayload> = {
    id: createId("task"),
    kind: input.kind,
    label: input.label,
    payload: input.payload,
    status: "queued",
    progress: {},
    queuedAt: Date.now(),
  };

  queueStore.setState((state) => ({ ...state, tasks: [...state.tasks, task as QueueTask] }));
  pump();
  return task.id;
}

export function isTaskLive(id: string): boolean {
  return live.has(id);
}

export function pauseTask(id: string): void {
  pausedTasks.add(id);
  patch(id, { status: "paused" });
}

/** Only a live task can be resumed in place; a restored one has to be started again. */
export function resumeTask(id: string): boolean {
  if (!live.has(id)) return false;

  pausedTasks.delete(id);
  patch(id, { status: "running" });
  return true;
}

export function cancelTask(id: string): void {
  const task = queueStore.getState().tasks.find((candidate) => candidate.id === id);
  if (!task) return;

  // Nothing is polling a queued task, and nothing is polling one left behind by a
  // closed page either, so both are cancelled outright rather than flagged.
  if (task.status === "queued" || !live.has(id)) {
    cancelled.delete(id);
    pausedTasks.delete(id);
    patch(id, { status: "cancelled", finishedAt: Date.now(), resumable: false });
    pump();
    return;
  }

  // A running task only stops where its runner next polls isCancelled().
  cancelled.add(id);
  pausedTasks.delete(id);
}

export function retryTask(id: string): string | undefined {
  const task = queueStore.getState().tasks.find((candidate) => candidate.id === id);
  if (!task) return undefined;
  removeTask(id);
  return enqueue({ kind: task.kind, label: task.label, payload: task.payload });
}

export function clearFinished(): void {
  queueStore.setState((state) => ({
    ...state,
    tasks: state.tasks.filter((task) => isActive(task.status)),
  }));
}

export function removeTask(id: string): void {
  queueStore.setState((state) => ({ ...state, tasks: state.tasks.filter((task) => task.id !== id) }));
}

function patch(id: string, changes: Partial<QueueTask>): void {
  queueStore.setState((state) => ({
    ...state,
    tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
  }));
}

export function isActive(status: TaskStatus): boolean {
  return status === "queued" || status === "running" || status === "paused" ||
    status === "throttled" || status === "waiting";
}

function countRunning(): number {
  return queueStore.getState().tasks.filter(
    (task) => task.status !== "queued" && isActive(task.status)
  ).length;
}

/** Starts as many queued tasks as the concurrency ceiling allows. */
function pump(): void {
  const { tasks, concurrency } = queueStore.getState();
  let slots = concurrency - countRunning();

  for (const task of tasks) {
    if (slots <= 0) break;
    if (task.status !== "queued") continue;
    slots = slots - 1;
    void start(task);
  }
}

async function start(task: QueueTask): Promise<void> {
  const runner = runners.get(task.kind);

  if (!runner) {
    patch(task.id, {
      status: "failed",
      error: `No runner registered for task kind "${task.kind}".`,
      finishedAt: Date.now(),
    });
    pump();
    return;
  }

  live.add(task.id);
  patch(task.id, { status: "running", startedAt: Date.now(), progress: {}, resumable: false, error: undefined });

  const controls: TaskControls = {
    report: (progress) => patch(task.id, { progress }),
    setStatus: (status) => patch(task.id, { status }),
    isCancelled: () => cancelled.has(task.id),
    isPaused: () => pausedTasks.has(task.id),
  };

  try {
    const result = await runner(task.payload, controls);
    if (cancelled.has(task.id)) {
      patch(task.id, { status: "cancelled", finishedAt: Date.now() });
    } else {
      patch(task.id, { status: "succeeded", result, finishedAt: Date.now(), progress: { ratio: 1 } });
    }
  } catch (error) {
    patch(task.id, { status: "failed", error: toErrorMessage(error), finishedAt: Date.now() });
  } finally {
    live.delete(task.id);
    cancelled.delete(task.id);
    pausedTasks.delete(task.id);
    pump();
  }
}

export function useQueue(): QueueState {
  return useStore(queueStore);
}

export function useActiveTaskCount(): number {
  return useStore(queueStore, (state) => state.tasks.filter((task) => isActive(task.status)).length);
}

export function getTask(id: string): QueueTask | undefined {
  return queueStore.getState().tasks.find((task) => task.id === id);
}
