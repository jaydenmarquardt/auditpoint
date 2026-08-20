import * as React from "react";
import { Theme } from "../../theme/Theme.api";
import { statusTone, statusText } from "./StatusBadge";
const INDETERMINATE = ["running"];
/** Statuses where work is still happening, so the bar should not look settled. */
const ACTIVE = ["running", "throttled", "waiting", "queued"];
export const ProgressBar = ({ label, description, ratio, status = "running", compact, countLabel, }) => {
    const palette = Theme.tone(statusTone(status));
    const height = compact ? 6 : 12;
    const indeterminate = ratio === undefined && INDETERMINATE.indexOf(status) !== -1;
    const active = ACTIVE.indexOf(status) !== -1;
    const width = ratio === undefined ? (indeterminate ? 40 : 0) : Math.round(ratio * 100);
    return (React.createElement("div", null,
        (label || countLabel) && (React.createElement("div", { style: {
                display: "flex",
                justifyContent: "space-between",
                gap: Theme.tokens.space.sm,
                fontSize: Theme.tokens.font.sm,
                marginBottom: 4,
            } },
            React.createElement("span", null, label),
            React.createElement("span", { style: { color: Theme.palette().textMuted } }, countLabel !== null && countLabel !== void 0 ? countLabel : (ratio !== undefined ? `${width}%` : statusText(status))))),
        React.createElement("div", { role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": ratio === undefined ? undefined : width, "aria-label": label !== null && label !== void 0 ? label : statusText(status), style: {
                position: "relative",
                height,
                borderRadius: height,
                background: Theme.chart().track,
                overflow: "hidden",
            } },
            React.createElement("div", { style: {
                    position: "absolute",
                    insetBlock: 0,
                    left: 0,
                    width: `${width}%`,
                    background: palette.solid,
                    borderRadius: height,
                    transition: "width 200ms ease",
                    animation: indeterminate ? "auditpoint-indeterminate 1.4s ease-in-out infinite" : undefined,
                } }, active && (React.createElement("span", { "aria-hidden": "true", style: {
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.38) 0 8px, transparent 8px 18px)",
                    backgroundSize: "36px 100%",
                    animation: "auditpoint-stripes 1s linear infinite",
                } })))),
        description && (React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginTop: 4 } }, description))));
};
//# sourceMappingURL=ProgressBar.js.map