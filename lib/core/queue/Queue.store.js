import { __awaiter } from "tslib";
import { createStore, useStore } from "../state/Store";
import { createId } from "../../utils/Id.util";
import { toErrorMessage } from "../../utils/Guard.util";
const runners = new Map();
const cancelled = new Set();
const pausedTasks = new Set();
/**
 * Tasks with a runner actually executing in this page session. A task restored from
 * a previous session has none, so nothing would ever act on a pause or a cancel.
 */
const live = new Set();
export const queueStore = createStore({ tasks: [], concurrency: 1 });
export function registerTaskRunner(kind, runner) {
    runners.set(kind, runner);
}
export function setConcurrency(concurrency) {
    queueStore.setState((state) => (Object.assign(Object.assign({}, state), { concurrency: Math.max(1, concurrency) })));
    pump();
}
export function enqueue(input) {
    const task = {
        id: createId("task"),
        kind: input.kind,
        label: input.label,
        payload: input.payload,
        status: "queued",
        progress: {},
        queuedAt: Date.now(),
    };
    queueStore.setState((state) => (Object.assign(Object.assign({}, state), { tasks: [...state.tasks, task] })));
    pump();
    return task.id;
}
export function isTaskLive(id) {
    return live.has(id);
}
export function pauseTask(id) {
    pausedTasks.add(id);
    patch(id, { status: "paused" });
}
/** Only a live task can be resumed in place; a restored one has to be started again. */
export function resumeTask(id) {
    if (!live.has(id))
        return false;
    pausedTasks.delete(id);
    patch(id, { status: "running" });
    return true;
}
export function cancelTask(id) {
    const task = queueStore.getState().tasks.find((candidate) => candidate.id === id);
    if (!task)
        return;
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
export function retryTask(id) {
    const task = queueStore.getState().tasks.find((candidate) => candidate.id === id);
    if (!task)
        return undefined;
    removeTask(id);
    return enqueue({ kind: task.kind, label: task.label, payload: task.payload });
}
export function clearFinished() {
    queueStore.setState((state) => (Object.assign(Object.assign({}, state), { tasks: state.tasks.filter((task) => isActive(task.status)) })));
}
export function removeTask(id) {
    queueStore.setState((state) => (Object.assign(Object.assign({}, state), { tasks: state.tasks.filter((task) => task.id !== id) })));
}
function patch(id, changes) {
    queueStore.setState((state) => (Object.assign(Object.assign({}, state), { tasks: state.tasks.map((task) => (task.id === id ? Object.assign(Object.assign({}, task), changes) : task)) })));
}
export function isActive(status) {
    return status === "queued" || status === "running" || status === "paused" ||
        status === "throttled" || status === "waiting";
}
function countRunning() {
    return queueStore.getState().tasks.filter((task) => task.status !== "queued" && isActive(task.status)).length;
}
/** Starts as many queued tasks as the concurrency ceiling allows. */
function pump() {
    const { tasks, concurrency } = queueStore.getState();
    let slots = concurrency - countRunning();
    for (const task of tasks) {
        if (slots <= 0)
            break;
        if (task.status !== "queued")
            continue;
        slots = slots - 1;
        void start(task);
    }
}
function start(task) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const controls = {
            report: (progress) => patch(task.id, { progress }),
            setStatus: (status) => patch(task.id, { status }),
            isCancelled: () => cancelled.has(task.id),
            isPaused: () => pausedTasks.has(task.id),
        };
        try {
            const result = yield runner(task.payload, controls);
            if (cancelled.has(task.id)) {
                patch(task.id, { status: "cancelled", finishedAt: Date.now() });
            }
            else {
                patch(task.id, { status: "succeeded", result, finishedAt: Date.now(), progress: { ratio: 1 } });
            }
        }
        catch (error) {
            patch(task.id, { status: "failed", error: toErrorMessage(error), finishedAt: Date.now() });
        }
        finally {
            live.delete(task.id);
            cancelled.delete(task.id);
            pausedTasks.delete(task.id);
            pump();
        }
    });
}
export function useQueue() {
    return useStore(queueStore);
}
export function useActiveTaskCount() {
    return useStore(queueStore, (state) => state.tasks.filter((task) => isActive(task.status)).length);
}
export function getTask(id) {
    return queueStore.getState().tasks.find((task) => task.id === id);
}
//# sourceMappingURL=Queue.store.js.map