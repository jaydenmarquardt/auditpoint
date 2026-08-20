export function formatDate(value) {
    if (!value)
        return "-";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return "-";
    return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(value) {
    if (!value)
        return "-";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return "-";
    return date.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
export function formatNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value))
        return "-";
    return value.toLocaleString();
}
export function formatBytes(bytes) {
    if (typeof bytes !== "number" || bytes < 0)
        return "-";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
        size = size / 1024;
        unit = unit + 1;
    }
    return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}
export function formatDuration(ms) {
    if (ms < 1000)
        return `${Math.round(ms)}ms`;
    const seconds = Math.round(ms / 1000);
    if (seconds < 60)
        return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}
export function pluralise(count, singular, plural) {
    return count === 1 ? singular : plural !== null && plural !== void 0 ? plural : `${singular}s`;
}
/** Rough time remaining from the rate so far. Good enough to set expectations. */
export function estimateRemaining(startedIso, processed, total) {
    if (!startedIso || !total || processed <= 0 || processed >= total)
        return "";
    const elapsed = Date.now() - new Date(startedIso).getTime();
    const remaining = ((total - processed) * elapsed) / processed;
    return formatDuration(remaining);
}
export function durationBetween(startIso, endIso) {
    if (!startIso)
        return "-";
    const end = endIso ? new Date(endIso).getTime() : Date.now();
    return formatDuration(end - new Date(startIso).getTime());
}
//# sourceMappingURL=Format.util.js.map