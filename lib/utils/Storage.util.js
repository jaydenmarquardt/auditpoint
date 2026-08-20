const PREFIX = "auditpoint";
export function readLocal(key, fallback) {
    try {
        const raw = window.localStorage.getItem(`${PREFIX}:${key}`);
        return raw === null ? fallback : JSON.parse(raw);
    }
    catch (_a) {
        return fallback;
    }
}
export function writeLocal(key, value) {
    try {
        window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
    }
    catch (_a) {
        /* storage disabled, settings simply do not persist */
    }
}
//# sourceMappingURL=Storage.util.js.map