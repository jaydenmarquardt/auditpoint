import { __awaiter } from "tslib";
import { createId } from "../../utils/Id.util";
import { toErrorMessage } from "../../utils/Guard.util";
export function createEnvelope(definition, sites, config, createdBy, createdByLogin) {
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
export function runReport(definition, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const envelope = (_a = options.resumeFrom) !== null && _a !== void 0 ? _a : createEnvelope(definition, options.sites, options.config, options.createdBy, options.createdByLogin);
        envelope.status = "running";
        envelope.logs = (_b = envelope.logs) !== null && _b !== void 0 ? _b : [];
        envelope.sites = options.sites;
        envelope.config = options.config;
        envelope.version = definition.version;
        syncStages(definition, envelope);
        publish(envelope, options);
        for (const stage of definition.stages) {
            const state = stageState(envelope, stage.key);
            if (state.status === "succeeded" || state.status === "skipped")
                continue;
            if (options.isCancelled())
                return cancelRun(envelope, state, options);
            while (options.isPaused()) {
                state.status = "paused";
                publish(envelope, options);
                yield wait(500);
                if (options.isCancelled())
                    return cancelRun(envelope, state, options);
            }
            state.status = "running";
            state.startedIso = new Date().toISOString();
            addLog(envelope, options, stage.key, "info", `Stage started for ${options.sites.length} site(s)`);
            state.error = undefined;
            publish(envelope, options);
            try {
                for (const siteUrl of options.sites) {
                    yield stage.run(buildContext(envelope, state, siteUrl, options));
                    // A stage returns early on cancel, so the run stops here rather than
                    // recording a stage that never finished as succeeded.
                    if (options.isCancelled())
                        return cancelRun(envelope, state, options);
                }
                state.status = "succeeded";
                state.finishedIso = new Date().toISOString();
                addLog(envelope, options, stage.key, "info", `Stage finished, ${state.processed} processed`);
                yield checkpoint(envelope, options);
            }
            catch (error) {
                state.status = "failed";
                state.error = toErrorMessage(error);
                state.finishedIso = new Date().toISOString();
                envelope.status = "failed";
                addLog(envelope, options, stage.key, "error", (_c = state.error) !== null && _c !== void 0 ? _c : "Stage failed");
                addIssue(envelope, {
                    stage: stage.key,
                    target: (_d = options.sites[0]) !== null && _d !== void 0 ? _d : "",
                    code: (_e = statusOf(error)) !== null && _e !== void 0 ? _e : "error",
                    message: state.error,
                });
                yield checkpoint(envelope, options);
                return { envelope, stages: envelope.stages };
            }
        }
        envelope.status = "complete";
        yield checkpoint(envelope, options);
        return { envelope, stages: envelope.stages };
    });
}
/**
 * A cancelled run is thrown away rather than checkpointed: the caller drops it and
 * deletes any partial file, so saving here would only leave a run nobody can use.
 */
function cancelRun(envelope, state, options) {
    state.status = "cancelled";
    state.finishedIso = new Date().toISOString();
    envelope.status = "cancelled";
    publish(envelope, options);
    return { envelope, stages: envelope.stages };
}
function buildContext(envelope, state, siteUrl, options) {
    return {
        siteUrl,
        config: options.config,
        data: envelope.data,
        cursor: state.cursor,
        progress: (processed, total) => {
            state.processed = processed;
            state.total = total !== null && total !== void 0 ? total : state.total;
            publish(envelope, options, true);
        },
        setCursor: (cursor) => {
            state.cursor = cursor;
        },
        issue: (issue) => {
            addIssue(envelope, Object.assign(Object.assign({}, issue), { stage: state.key }));
            addLog(envelope, options, state.key, "warn", `${issue.target}: ${issue.message}`);
            publish(envelope, options);
        },
        log: (message, level = "info") => {
            addLog(envelope, options, state.key, level, message);
            publish(envelope, options);
        },
        isCancelled: options.isCancelled,
        waitIfPaused: () => __awaiter(this, void 0, void 0, function* () {
            while (options.isPaused() && !options.isCancelled()) {
                if (state.status !== "paused") {
                    state.status = "paused";
                    publish(envelope, options);
                }
                yield wait(400);
            }
            if (state.status === "paused" && !options.isCancelled()) {
                state.status = "running";
                publish(envelope, options);
            }
        }),
    };
}
function syncStages(definition, envelope) {
    envelope.stages = definition.stages.map((stage) => {
        const existing = envelope.stages.find((candidate) => candidate.key === stage.key);
        return existing !== null && existing !== void 0 ? existing : { key: stage.key, label: stage.label, status: "pending", processed: 0 };
    });
}
function stageState(envelope, key) {
    const found = envelope.stages.find((stage) => stage.key === key);
    if (!found)
        throw new Error(`Unknown stage "${key}".`);
    return found;
}
function addIssue(envelope, issue) {
    envelope.issues.push(Object.assign(Object.assign({}, issue), { iso: new Date().toISOString() }));
}
const MAX_LOGS = 500;
function addLog(envelope, options, stage, level, message) {
    var _a;
    if (!options.captureLogs)
        return;
    envelope.logs = [...((_a = envelope.logs) !== null && _a !== void 0 ? _a : []), { iso: new Date().toISOString(), stage, level, message }].slice(-MAX_LOGS);
}
/**
 * A stage reports progress per item, which on a long run is thousands of updates a
 * minute. Every one of them re-rendered the page and rebuilt its view, so progress
 * is published on a timer and `updatedIso` only moves when something real happened:
 * the pages that derive from the run key their memos off it.
 */
const PUBLISH_EVERY_MS = 400;
let lastPublish = 0;
function publish(envelope, options, progressOnly = false) {
    const now = Date.now();
    if (progressOnly && now - lastPublish < PUBLISH_EVERY_MS)
        return;
    lastPublish = now;
    if (!progressOnly)
        envelope.updatedIso = new Date().toISOString();
    options.onUpdate(Object.assign(Object.assign({}, envelope), { stages: [...envelope.stages], issues: [...envelope.issues] }));
}
function checkpoint(envelope, options) {
    return __awaiter(this, void 0, void 0, function* () {
        publish(envelope, options);
        yield options.persist(envelope);
    });
}
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function statusOf(error) {
    var _a;
    const candidate = error;
    return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.status) !== null && _a !== void 0 ? _a : candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus;
}
//# sourceMappingURL=Report.engine.js.map