import { queueStore } from "./Queue.store";
import { readLocal, writeLocal } from "../../utils/Storage.util";
const KEY = "queue";
const MAX_TASKS = 40;
const PERSIST_EVERY_MS = 2000;
/**
 * The queue lives in the browser, so a reload would otherwise lose every record
 * of what was running. Reports themselves checkpoint to the report library.
 */
let subscribed = false;
export function restoreQueue() {
    const saved = readLocal(KEY, []);
    const tasks = saved.map((task) => {
        var _a;
        return task.status === "running" || task.status === "queued" || task.status === "throttled" || task.status === "waiting"
            ? Object.assign(Object.assign({}, task), { status: "paused", resumable: true, error: (_a = task.error) !== null && _a !== void 0 ? _a : INTERRUPTED }) : task;
    });
    if (tasks.length > 0)
        queueStore.setState((state) => (Object.assign(Object.assign({}, state), { tasks })));
    if (subscribed)
        return;
    subscribed = true;
    let pending;
    queueStore.subscribe((state) => {
        // Serialising the whole queue on every progress update was costing more than the
        // work it was recording, so writes are coalesced and the child progress dropped.
        if (pending !== undefined)
            return;
        pending = window.setTimeout(() => {
            pending = undefined;
            writeLocal(KEY, state.tasks.slice(-MAX_TASKS).map((task) => (Object.assign(Object.assign({}, task), { result: undefined, progress: Object.assign(Object.assign({}, task.progress), { children: undefined }) }))));
        }, PERSIST_EVERY_MS);
    });
}
export const INTERRUPTED = "The page was closed or reloaded before this task finished.";
//# sourceMappingURL=Queue.persist.js.map