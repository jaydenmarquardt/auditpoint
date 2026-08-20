import { formatDuration } from "../../utils/Format.util";
export function taskDuration(task) {
    var _a;
    if (!task.startedAt)
        return "-";
    return formatDuration(((_a = task.finishedAt) !== null && _a !== void 0 ? _a : Date.now()) - task.startedAt);
}
export function isFinished(task) {
    return task.status === "succeeded" || task.status === "failed" || task.status === "cancelled";
}
//# sourceMappingURL=Queue.logic.js.map