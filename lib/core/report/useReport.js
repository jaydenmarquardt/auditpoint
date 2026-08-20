import { __awaiter } from "tslib";
import { useCallback, useState } from "react";
import { cancelTask, getTask, isTaskLive, pauseTask, removeTask, resumeTask } from "../queue/Queue.store";
import { Reports } from "../../api/Reports.api";
import { clearRun, openEnvelope, startReport, useReportRun } from "./Report.store";
import { toErrorMessage } from "../../utils/Guard.util";
const MISSING_REPORT = "That report could not be opened. It may have been deleted or you may not have access.";
export function useReport(definition) {
    var _a;
    const run = useReportRun(definition.kind);
    const status = (_a = run.taskStatus) !== null && _a !== void 0 ? _a : "idle";
    const envelope = run.envelope;
    const [config, setConfig] = useState(definition.defaultConfig);
    const [error, setError] = useState(undefined);
    const start = useCallback((sites) => {
        startReport(definition, { sites, config });
    }, [definition, config]);
    const resume = useCallback(() => {
        const task = run.taskId ? getTask(run.taskId) : undefined;
        // A run interrupted by a reload keeps its paused task but has no runner behind it,
        // so it restarts from the checkpointed envelope instead.
        if ((task === null || task === void 0 ? void 0 : task.status) === "paused" && isTaskLive(task.id) && resumeTask(task.id))
            return;
        if (task && !isTaskLive(task.id))
            cancelTask(task.id);
        if (envelope)
            startReport(definition, { resumeFrom: envelope, sites: envelope.sites, config });
    }, [definition, envelope, run.taskId, config]);
    const pause = useCallback(() => {
        if (run.taskId)
            pauseTask(run.taskId);
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
    const open = useCallback((serverRelativeUrl) => __awaiter(this, void 0, void 0, function* () {
        setError(undefined);
        try {
            const saved = yield Reports().read(serverRelativeUrl);
            openEnvelope(saved);
        }
        catch (failure) {
            // A run deleted since the list was drawn is the common case, so say so rather
            // than leaving a button that appears to do nothing.
            setError(`${MISSING_REPORT} ${toErrorMessage(failure)}`);
        }
    }), []);
    const importJson = useCallback((file) => __awaiter(this, void 0, void 0, function* () {
        setError(undefined);
        try {
            const parsed = JSON.parse(yield file.text());
            if (!(parsed === null || parsed === void 0 ? void 0 : parsed.kind) || !Array.isArray(parsed.stages))
                throw new Error("That file is not a saved run.");
            if (parsed.kind !== definition.kind)
                throw new Error(`That file holds a ${parsed.kind} run.`);
            openEnvelope(parsed);
        }
        catch (failure) {
            setError(toErrorMessage(failure));
        }
    }), [definition.kind]);
    const resumeSaved = useCallback((serverRelativeUrl) => __awaiter(this, void 0, void 0, function* () {
        setError(undefined);
        try {
            const saved = yield Reports().read(serverRelativeUrl);
            startReport(definition, { resumeFrom: saved, sites: saved.sites, config: saved.config });
        }
        catch (failure) {
            setError(`${MISSING_REPORT} ${toErrorMessage(failure)}`);
        }
    }), [definition]);
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
//# sourceMappingURL=useReport.js.map