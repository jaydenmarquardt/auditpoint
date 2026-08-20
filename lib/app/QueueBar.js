import * as React from "react";
import { Theme } from "../theme/Theme.api";
import { Badge } from "../components/feedback/Badge";
import { Button } from "../components/actions/Button";
import { IconButton } from "../components/actions/IconButton";
import { ProgressBar } from "../components/feedback/ProgressBar";
import { TaskCard } from "./TaskCard";
import { ErrorDrawer } from "../components/feedback/ErrorDrawer";
import { clearFinished, isActive, retryTask, useQueue } from "../core/queue/Queue.store";
import { navigate, toggleQueueBar, useAppState } from "../core/state/App.store";
import { useThrottleState } from "../api/Throttle.api";
import { QueueBarContent } from "./QueueBar.content";
export const QueueBar = () => {
    var _a, _b;
    const { tasks } = useQueue();
    const [errorTask, setErrorTask] = React.useState(undefined);
    const open = useAppState((state) => state.queueBarOpen);
    const throttle = useThrottleState();
    const active = tasks.filter((task) => isActive(task.status));
    const current = active[0];
    return (React.createElement(React.Fragment, null,
        open && (React.createElement("div", { role: "presentation", onClick: toggleQueueBar, style: {
                position: "absolute",
                inset: 0,
                background: "rgba(16, 24, 40, 0.35)",
                zIndex: Theme.tokens.zIndex.topbar,
            } })),
        React.createElement("section", { "aria-label": QueueBarContent.label, style: {
                position: "absolute",
                insetInline: 0,
                bottom: 0,
                zIndex: Theme.tokens.zIndex.topbar + 1,
                background: Theme.palette().surface,
                borderTop: `2px solid ${open ? Theme.palette().accent : Theme.palette().border}`,
                boxShadow: open ? "0 -8px 24px rgba(16,24,40,0.18)" : Theme.tokens.shadow.md,
            } },
            open && (React.createElement("div", { style: {
                    maxHeight: "46vh",
                    overflowY: "auto",
                    padding: Theme.tokens.space.md,
                    background: Theme.palette().surfaceAlt,
                    borderBottom: `1px solid ${Theme.palette().border}`,
                    animation: "auditpoint-slide-up 160ms ease",
                } },
                React.createElement("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: Theme.tokens.space.sm,
                    } },
                    React.createElement("strong", null, QueueBarContent.label),
                    React.createElement(Button, { label: QueueBarContent.close, iconName: "ChevronDown", variant: "subtle", onClick: toggleQueueBar })),
                tasks.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, QueueBarContent.idle)) : (React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.md } }, tasks.map((task) => (React.createElement("li", { key: task.id },
                    React.createElement(TaskCard, { task: task, onViewError: setErrorTask, compact: true })))))))),
            React.createElement("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: Theme.tokens.space.sm,
                    padding: `0 ${Theme.tokens.space.md}`,
                    height: 48,
                } },
                React.createElement(IconButton, { iconName: open ? "ChevronDown" : "ChevronUp", ariaLabel: open ? QueueBarContent.close : QueueBarContent.open, onClick: toggleQueueBar, toggled: open }),
                React.createElement("strong", { style: { fontSize: Theme.tokens.font.sm } }, QueueBarContent.label),
                React.createElement(Badge, { label: `${active.length} ${QueueBarContent.active}`, tone: active.length > 0 ? "info" : "neutral" }),
                throttle.status === "throttled" && React.createElement(Badge, { label: QueueBarContent.throttled, tone: "warning" }),
                React.createElement("div", { style: { flex: "1 1 auto", minWidth: 0, maxWidth: 420, marginRight: "auto" } }, current && (React.createElement(ProgressBar, { compact: true, ratio: current.progress.ratio, status: current.status, label: current.label, countLabel: current.progress.message }))),
                React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, marginLeft: "auto" } },
                    React.createElement(Button, { label: QueueBarContent.clear, iconName: "Delete", variant: "subtle", onClick: clearFinished }),
                    React.createElement(Button, { label: QueueBarContent.viewAll, iconName: "OpenInNewWindow", variant: "subtle", onClick: () => navigate("queue") }))),
            React.createElement(ErrorDrawer, { open: Boolean(errorTask), title: (_a = errorTask === null || errorTask === void 0 ? void 0 : errorTask.label) !== null && _a !== void 0 ? _a : "", message: (_b = errorTask === null || errorTask === void 0 ? void 0 : errorTask.error) !== null && _b !== void 0 ? _b : "", context: errorTask ? [{ label: "Task", value: errorTask.kind }] : undefined, onDismiss: () => setErrorTask(undefined), onRetry: errorTask
                    ? () => {
                        retryTask(errorTask.id);
                        setErrorTask(undefined);
                    }
                    : undefined }))));
};
//# sourceMappingURL=QueueBar.js.map