import { __awaiter } from "tslib";
import { createStore, useStore } from "../core/state/Store";
import { toErrorMessage } from "../utils/Guard.util";
const DEFAULTS = {
    concurrency: 4,
    maxRetries: 5,
    baseDelayMs: 1000,
    maxDelayMs: 60000,
};
let options = Object.assign({}, DEFAULTS);
let paused = false;
const pending = [];
export const throttleStore = createStore({
    status: "idle",
    inFlight: 0,
    queued: 0,
    completed: 0,
    failed: 0,
    retries: 0,
});
export function configureThrottle(next) {
    options = Object.assign(Object.assign({}, options), next);
    pump();
}
export function pauseThrottle() {
    paused = true;
    patch({ status: "paused" });
}
export function resumeThrottle() {
    paused = false;
    patch({ status: pending.length > 0 ? "running" : "idle", resumesAt: undefined });
    pump();
}
export function isThrottlePaused() {
    return paused;
}
export function useThrottleState() {
    return useStore(throttleStore);
}
/** Every SharePoint call goes through here so 429/503 backoff is handled in one place. */
export function throttled(run, callOptions = {}) {
    return new Promise((resolve, reject) => {
        var _a;
        const call = {
            run,
            resolve,
            reject,
            retries: (_a = callOptions.retries) !== null && _a !== void 0 ? _a : options.maxRetries,
            attempt: 0,
            priority: Boolean(callOptions.priority),
        };
        if (call.priority)
            pending.unshift(call);
        else
            pending.push(call);
        patch({ queued: pending.length, status: paused ? "paused" : "running" });
        pump();
    });
}
export function throttledAll(runners_1) {
    return __awaiter(this, arguments, void 0, function* (runners, callOptions = {}) {
        return Promise.all(runners.map((runner) => throttled(runner, callOptions)));
    });
}
function patch(changes) {
    throttleStore.setState((state) => (Object.assign(Object.assign({}, state), changes)));
}
function pump() {
    if (paused)
        return;
    while (throttleStore.getState().inFlight < options.concurrency && pending.length > 0) {
        const call = pending.shift();
        if (!call)
            return;
        patch({ queued: pending.length, inFlight: throttleStore.getState().inFlight + 1, status: "running" });
        void execute(call);
    }
    if (pending.length === 0 && throttleStore.getState().inFlight === 0)
        patch({ status: "idle" });
}
function execute(call) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield call.run();
            patch({ completed: throttleStore.getState().completed + 1 });
            call.resolve(result);
        }
        catch (error) {
            const wait = retryDelay(error, call.attempt);
            if (wait !== undefined && call.attempt < call.retries) {
                call.attempt = call.attempt + 1;
                patch({
                    retries: throttleStore.getState().retries + 1,
                    status: "throttled",
                    resumesAt: Date.now() + wait,
                });
                setTimeout(() => {
                    pending.unshift(call);
                    patch({ queued: pending.length, resumesAt: undefined });
                    pump();
                }, wait);
            }
            else {
                patch({ failed: throttleStore.getState().failed + 1, lastError: toErrorMessage(error) });
                call.reject(error);
            }
        }
        finally {
            patch({ inFlight: Math.max(0, throttleStore.getState().inFlight - 1) });
            pump();
        }
    });
}
function retryDelay(error, attempt) {
    const status = readStatus(error);
    if (status !== 429 && status !== 503 && status !== 504)
        return undefined;
    const retryAfter = readRetryAfter(error);
    if (retryAfter !== undefined)
        return Math.min(retryAfter * 1000, options.maxDelayMs);
    const backoff = options.baseDelayMs * Math.pow(2, attempt);
    return Math.min(backoff + Math.random() * 250, options.maxDelayMs);
}
function readStatus(error) {
    var _a;
    const candidate = error;
    if (typeof (candidate === null || candidate === void 0 ? void 0 : candidate.status) === "number")
        return candidate.status;
    if (typeof (candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus) === "number")
        return candidate.httpStatus;
    const match = /\b(429|503|504)\b/.exec((_a = candidate === null || candidate === void 0 ? void 0 : candidate.message) !== null && _a !== void 0 ? _a : "");
    return match ? Number(match[1]) : undefined;
}
function readRetryAfter(error) {
    const headers = error === null || error === void 0 ? void 0 : error.headers;
    const raw = headers && typeof headers.get === "function" ? headers.get("Retry-After") : undefined;
    const parsed = raw ? Number(raw) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : undefined;
}
//# sourceMappingURL=Throttle.api.js.map