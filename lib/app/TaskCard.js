import * as React from "react";
import { Theme } from "../theme/Theme.api";
import { Button } from "../components/actions/Button";
import { ProgressBar } from "../components/feedback/ProgressBar";
import { StatusBadge, statusTone } from "../components/feedback/StatusBadge";
import { cancelTask, isActive, isTaskLive, pauseTask, removeTask, resumeTask, retryTask } from "../core/queue/Queue.store";
import { formatDateTime, formatDuration } from "../utils/Format.util";
import { QueueBarContent } from "./QueueBar.content";
export const TaskCard = ({ task, onViewError }) => {
    var _a, _b;
    const [open, setOpen] = React.useState(false);
    const status = task.status;
    const tone = Theme.tone(statusTone(status));
    const children = (_a = task.progress.children) !== null && _a !== void 0 ? _a : [];
    const elapsed = task.startedAt ? formatDuration(((_b = task.finishedAt) !== null && _b !== void 0 ? _b : Date.now()) - task.startedAt) : "-";
    // A task left behind by a closed page has no runner to resume, so it is started again.
    const live = isTaskLive(task.id);
    return (React.createElement("section", { style: {
            border: `1px solid ${Theme.palette().border}`,
            borderLeft: `3px solid ${tone.solid}`,
            borderRadius: Theme.tokens.radius.md,
            background: Theme.palette().surface,
            padding: Theme.tokens.space.md,
            display: "grid",
            gap: Theme.tokens.space.sm,
            minWidth: 0,
        } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, flexWrap: "wrap" } },
            React.createElement(StatusBadge, { status: status }),
            React.createElement("div", { style: { minWidth: 0, flex: "1 1 220px" } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, task.label),
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } },
                    task.kind,
                    " \u00B7 queued ",
                    formatDateTime(new Date(task.queuedAt)),
                    " \u00B7 ",
                    elapsed)),
            React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
                task.status === "running" && (React.createElement(Button, { label: QueueBarContent.pause, variant: "subtle", iconName: "Pause", onClick: () => pauseTask(task.id) })),
                task.status === "paused" && live && (React.createElement(Button, { label: QueueBarContent.resume, variant: "subtle", iconName: "Play", onClick: () => resumeTask(task.id) })),
                task.status === "paused" && !live && (React.createElement(Button, { label: QueueBarContent.retry, variant: "subtle", iconName: "Refresh", onClick: () => retryTask(task.id) })),
                isActive(task.status) && (React.createElement(Button, { label: QueueBarContent.cancel, variant: "subtle", iconName: "Cancel", onClick: () => cancelTask(task.id) })),
                task.status === "failed" && (React.createElement(React.Fragment, null,
                    React.createElement(Button, { label: QueueBarContent.viewError, variant: "subtle", iconName: "Error", onClick: () => onViewError(task) }),
                    React.createElement(Button, { label: QueueBarContent.retry, variant: "subtle", iconName: "Refresh", onClick: () => retryTask(task.id) }))),
                !isActive(task.status) && (React.createElement(Button, { label: QueueBarContent.remove, variant: "subtle", iconName: "Delete", onClick: () => removeTask(task.id) })))),
        React.createElement(ProgressBar, { ratio: task.progress.ratio, status: status, countLabel: task.progress.message, description: task.error }),
        children.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("button", { type: "button", onClick: () => setOpen(!open), "aria-expanded": open, style: {
                    justifySelf: "start",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    minHeight: 32,
                    padding: `0 ${Theme.tokens.space.sm}`,
                    border: `1px solid ${Theme.palette().border}`,
                    borderRadius: Theme.tokens.radius.sm,
                    background: Theme.palette().surface,
                    font: "inherit",
                    fontSize: Theme.tokens.font.sm,
                    cursor: "pointer",
                } },
                React.createElement("i", { className: `ms-Icon ms-Icon--${open ? "ChevronUp" : "ChevronDown"}`, "aria-hidden": "true" }),
                open ? QueueBarContent.hideSteps : `${QueueBarContent.showSteps} (${children.length})`),
            open && (React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm } }, children.map((child) => (React.createElement("li", { key: child.key },
                React.createElement(ProgressBar, { label: child.label, ratio: child.ratio, status: child.status, countLabel: child.message }))))))))));
};
//# sourceMappingURL=TaskCard.js.map