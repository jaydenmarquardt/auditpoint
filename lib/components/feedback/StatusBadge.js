import * as React from "react";
import { Badge } from "./Badge";
const MAP = {
    pending: { tone: "neutral", icon: "CircleRing", label: "Pending" },
    waiting: { tone: "neutral", icon: "Clock", label: "Waiting" },
    running: { tone: "info", icon: "Sync", label: "Running" },
    throttled: { tone: "warning", icon: "Hourglass", label: "Throttled" },
    paused: { tone: "warning", icon: "Pause", label: "Paused" },
    succeeded: { tone: "success", icon: "CompletedSolid", label: "Done" },
    failed: { tone: "danger", icon: "ErrorBadge", label: "Failed" },
    cancelled: { tone: "neutral", icon: "Cancel", label: "Cancelled" },
    skipped: { tone: "neutral", icon: "Blocked", label: "Skipped" },
    queued: { tone: "neutral", icon: "Clock", label: "Queued" },
    interrupted: { tone: "warning", icon: "PlugDisconnected", label: "Interrupted" },
};
/** Queue and stage statuses both land here, so an unknown one must not throw. */
function entryFor(status) {
    var _a;
    return (_a = MAP[status]) !== null && _a !== void 0 ? _a : MAP.pending;
}
export const StatusBadge = ({ status, label }) => {
    const entry = entryFor(status);
    return React.createElement(Badge, { label: label !== null && label !== void 0 ? label : entry.label, tone: entry.tone, iconName: entry.icon });
};
export function statusTone(status) {
    return entryFor(status).tone;
}
export function statusText(status) {
    return entryFor(status).label;
}
//# sourceMappingURL=StatusBadge.js.map