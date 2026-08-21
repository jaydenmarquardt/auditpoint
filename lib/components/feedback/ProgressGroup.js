import * as React from "react";
import { Theme } from "../../theme/Theme.api";
import { ProgressBar } from "./ProgressBar";
import { statusTone, statusText } from "./StatusBadge";
const WORK_LABEL = { network: "Requests", client: "Local", both: "Requests + local" };
const WORK_ICON = { network: "Cloud", client: "Processing", both: "SyncOccurence" };
const ICONS = {
    pending: "CircleRing",
    queued: "Clock",
    interrupted: "PlugDisconnected",
    waiting: "Clock",
    running: "SyncOccurence",
    throttled: "Hourglass",
    paused: "CirclePause",
    succeeded: "CompletedSolid",
    failed: "StatusErrorFull",
    cancelled: "Cancel",
    skipped: "Blocked",
};
export const ProgressGroup = ({ label, status = "running", ratio, steps, description, collapsible = true, defaultOpen = false, stepsLabel = "steps", }) => {
    const [open, setOpen] = React.useState(defaultOpen);
    return (React.createElement("section", { style: {
            border: `1px solid ${Theme.palette().border}`,
            borderRadius: Theme.tokens.radius.md,
            background: Theme.palette().surface,
            overflow: "hidden",
            minWidth: 0,
        } },
        React.createElement("header", { style: { padding: Theme.tokens.space.md, display: "grid", gap: Theme.tokens.space.sm } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: Theme.tokens.space.sm } },
                React.createElement("strong", null, label),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm } },
                    React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.tone(statusTone(status)).fg, fontWeight: 600 } }, statusText(status)),
                    collapsible && steps.length > 0 && (React.createElement("button", { type: "button", onClick: () => setOpen(!open), "aria-expanded": open, style: {
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            minHeight: 32,
                            padding: `0 ${Theme.tokens.space.sm}`,
                            border: `1px solid ${Theme.palette().border}`,
                            borderRadius: Theme.tokens.radius.sm,
                            background: Theme.palette().surface,
                            color: Theme.palette().text,
                            font: "inherit",
                            fontSize: Theme.tokens.font.sm,
                            cursor: "pointer",
                        } },
                        React.createElement("i", { className: `ms-Icon ms-Icon--${open ? "ChevronUp" : "ChevronDown"}`, "aria-hidden": "true" }),
                        open ? `Hide ${stepsLabel}` : `Show ${steps.length} ${stepsLabel}`)))),
            React.createElement(ProgressBar, { ratio: ratio, status: status }),
            description && (React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, description))),
        open && (React.createElement("ul", { style: {
                listStyle: "none",
                margin: 0,
                padding: 0,
                borderTop: `1px solid ${Theme.palette().border}`,
                background: Theme.palette().surfaceAlt,
            } }, steps.map((step) => (React.createElement(StepRow, { key: step.key, step: step })))))));
};
const StepRow = ({ step }) => {
    var _a;
    const tone = Theme.tone(statusTone(step.status));
    const active = step.status === "running" || step.status === "throttled";
    return (React.createElement("li", { style: {
            display: "grid",
            gridTemplateColumns: "24px minmax(0, 1fr)",
            alignItems: "center",
            columnGap: Theme.tokens.space.sm,
            padding: `${Theme.tokens.space.md} ${Theme.tokens.space.md}`,
            borderBottom: `1px solid ${Theme.palette().border}`,
            background: active ? Theme.palette().surface : "transparent",
        } },
        React.createElement("i", { className: `ms-Icon ms-Icon--${ICONS[step.status]}${active ? " auditpoint-spin" : ""}`, "aria-hidden": "true", style: { color: tone.solid, fontSize: 16 } }),
        React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.md,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                } },
                step.label,
                React.createElement("span", { style: {
                        marginLeft: Theme.tokens.space.sm,
                        fontSize: Theme.tokens.font.sm,
                        fontWeight: 400,
                        color: Theme.palette().textMuted,
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                    } }, (_a = step.countLabel) !== null && _a !== void 0 ? _a : statusText(step.status)),
                step.work && (React.createElement("span", { style: {
                        marginLeft: Theme.tokens.space.sm,
                        fontSize: Theme.tokens.font.sm,
                        fontWeight: 400,
                        color: Theme.palette().textMuted,
                        whiteSpace: "nowrap",
                    }, title: `This step is mostly ${WORK_LABEL[step.work].toLowerCase()}` },
                    React.createElement("i", { className: `ms-Icon ms-Icon--${WORK_ICON[step.work]}`, "aria-hidden": "true" }),
                    " ",
                    WORK_LABEL[step.work]))),
            (active || step.ratio !== undefined) && (React.createElement("div", { style: { marginTop: 8 } },
                React.createElement(ProgressBar, { ratio: step.ratio, status: step.status, compact: true }))),
            step.message && (React.createElement("div", { style: { marginTop: 4, fontSize: Theme.tokens.font.sm, color: tone.fg } }, step.message)))));
};
//# sourceMappingURL=ProgressGroup.js.map