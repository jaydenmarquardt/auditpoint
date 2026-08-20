import { __awaiter } from "tslib";
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** Bounded fan-out, unbounded Promise.all gets the tenant to 429. */
export function mapWithConcurrency(items, limit, worker) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = new Array(items.length);
        let cursor = 0;
        const runners = new Array(Math.max(1, Math.min(limit, items.length))).fill(0).map(() => __awaiter(this, void 0, void 0, function* () {
            for (;;) {
                const index = cursor;
                cursor = cursor + 1;
                if (index >= items.length)
                    return;
                results[index] = yield worker(items[index], index);
            }
        }));
        yield Promise.all(runners);
        return results;
    });
}
export function retry(operation_1) {
    return __awaiter(this, arguments, void 0, function* (operation, attempts = 3, backoffMs = 500) {
        let lastError;
        for (let attempt = 0; attempt < attempts; attempt = attempt + 1) {
            try {
                return yield operation();
            }
            catch (error) {
                lastError = error;
                if (attempt < attempts - 1)
                    yield delay(backoffMs * Math.pow(2, attempt));
            }
        }
        throw lastError;
    });
}
//# sourceMappingURL=Async.util.js.map