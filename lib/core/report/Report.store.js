import { __awaiter } from "tslib";
import { createStore, useStore } from "../state/Store";
import { enqueue, registerTaskRunner, getTask } from "../queue/Queue.store";
import { Reports } from "../../api/Reports.api";
import { getContext } from "../../api/Sp.api";
import { getSettings } from "../../api/Settings.api";
import { readLocal, writeLocal } from "../../utils/Storage.util";
import { runReport } from "./Report.engine";
export const reportStore = createStore({});
const definitions = new Map();
const hostConfigDefaults = new Map();
/**
 * Config a host wants a report to start with, keyed by report kind. Merged over the
 * report's own defaults, so a solution can raise a limit or switch a stage on
 * without touching the module.
 */
export function setReportDefaults(defaults) {
    hostConfigDefaults.clear();
    Object.keys(defaults !== null && defaults !== void 0 ? defaults : {}).forEach((kind) => hostConfigDefaults.set(kind, (defaults !== null && defaults !== void 0 ? defaults : {})[kind]));
}
/**
 * What a report starts with: its own defaults, then the host's, then the column
 * mapping the site itself has filled in, which is the most specific of the three.
 */
export function reportConfig(definition) {
    var _a;
    return Object.assign(Object.assign(Object.assign(Object.assign({}, definition.defaultConfig), ((_a = hostConfigDefaults.get(definition.kind)) !== null && _a !== void 0 ? _a : {})), mappedConfig(definition.kind, getSettings())), readLocal(configKey(definition.kind), {}));
}
export function saveReportConfig(kind, config) {
    writeLocal(configKey(kind), config);
}
export function clearReportConfig(kind) {
    writeLocal(configKey(kind), {});
}
function configKey(kind) {
    return `report-config:${kind}`;
}
/** Settings the site owner filled in that a report would otherwise have to guess. */
function mappedConfig(kind, settings) {
    const config = {};
    const columns = settings.fields.htmlFields.join(",");
    const dates = [settings.fields.reviewDate, settings.fields.expiryDate, settings.fields.publishDate]
        .filter((column) => column.trim().length > 0)
        .join(",");
    if (columns && ["content-audit", "images-audit", "link-audit"].indexOf(kind) !== -1) {
        config.columnNames = columns;
    }
    if (kind === "publishing-audit" && dates)
        config.dateColumns = dates;
    if (kind === "link-audit" && settings.legacyUrls.length > 0)
        config.legacyHosts = settings.legacyUrls.join(",");
    return config;
}
export function getReportDefinition(kind) {
    return definitions.get(kind);
}
export function resumeSavedEnvelope(envelope) {
    const definition = definitions.get(envelope.kind);
    if (!definition)
        return undefined;
    return startReport(definition, { resumeFrom: envelope, sites: envelope.sites, config: envelope.config });
}
export function taskKind(kind) {
    return `report:${kind}`;
}
export function registerReport(definition) {
    definitions.set(definition.kind, definition);
    registerTaskRunner(taskKind(definition.kind), (payload, controls) => __awaiter(this, void 0, void 0, function* () {
        const store = Reports();
        const result = yield runReport(definition, {
            sites: payload.sites,
            config: payload.config,
            resumeFrom: payload.resumeFrom,
            createdBy: getContext().pageContext.user.displayName,
            createdByLogin: getContext().pageContext.user.loginName,
            isCancelled: controls.isCancelled,
            isPaused: controls.isPaused,
            captureLogs: getSettings().captureReportLogs,
            onUpdate: (envelope) => {
                patch(definition.kind, { envelope: envelope });
                controls.report({
                    ratio: completion(envelope),
                    message: activeLabel(envelope),
                    children: envelope.stages.map(toChild),
                });
                // A pause is held by the queue, not the envelope, so a progress update
                // published mid stage must not report the run as running again.
                controls.setStatus(controls.isPaused() ? "paused" : taskStatus(envelope));
            },
            persist: (envelope) => __awaiter(this, void 0, void 0, function* () {
                const summary = yield store.save(envelope);
                patch(definition.kind, { savedUrl: summary.serverRelativeUrl });
            }),
        });
        return result.envelope;
    }));
}
export function startReport(definition, input = {}) {
    var _a, _b, _c, _d;
    const sites = (_a = input.sites) !== null && _a !== void 0 ? _a : getSettings().sites.map((site) => site.url);
    const config = (_d = (_b = input.config) !== null && _b !== void 0 ? _b : (_c = input.resumeFrom) === null || _c === void 0 ? void 0 : _c.config) !== null && _d !== void 0 ? _d : reportConfig(definition);
    const taskId = enqueue({
        kind: taskKind(definition.kind),
        label: definition.title,
        payload: { sites, config, resumeFrom: input.resumeFrom },
    });
    patch(definition.kind, {
        kind: definition.kind,
        taskId,
        envelope: input.resumeFrom,
    });
    return taskId;
}
export function openEnvelope(envelope) {
    patch(envelope.kind, { envelope, taskId: undefined });
}
export function clearRun(kind) {
    patch(kind, { envelope: undefined, taskId: undefined, savedUrl: undefined });
}
export function useReportRun(kind) {
    const state = useStore(reportStore, (all) => all[kind]);
    const task = (state === null || state === void 0 ? void 0 : state.taskId) ? getTask(state.taskId) : undefined;
    return Object.assign(Object.assign({}, (state !== null && state !== void 0 ? state : {})), { kind, taskStatus: task === null || task === void 0 ? void 0 : task.status });
}
function patch(kind, changes) {
    reportStore.setState((state) => {
        var _a;
        return (Object.assign(Object.assign({}, state), { [kind]: Object.assign(Object.assign(Object.assign({}, ((_a = state[kind]) !== null && _a !== void 0 ? _a : {})), changes), { kind }) }));
    });
}
function completion(envelope) {
    const done = envelope.stages.filter((stage) => stage.status === "succeeded" || stage.status === "skipped").length;
    return envelope.stages.length === 0 ? 0 : done / envelope.stages.length;
}
function activeLabel(envelope) {
    const active = envelope.stages.find((stage) => stage.status === "running");
    if (!active)
        return envelope.status;
    return active.total ? `${active.label} ${active.processed}/${active.total}` : active.label;
}
function toChild(stage) {
    return {
        key: stage.key,
        label: stage.label,
        status: stage.status,
        ratio: stage.total ? stage.processed / stage.total : undefined,
        message: stage.error,
    };
}
function taskStatus(envelope) {
    if (envelope.status === "cancelled")
        return "cancelled";
    if (envelope.status === "paused")
        return "paused";
    if (envelope.status === "failed")
        return "failed";
    return "running";
}
//# sourceMappingURL=Report.store.js.map