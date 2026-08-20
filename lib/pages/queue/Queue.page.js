import * as React from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/layout/Card";
import { StatTile } from "../../components/layout/StatTile";
import { Toolbar } from "../../components/layout/Toolbar";
import { Button } from "../../components/actions/Button";
import { NumberField } from "../../components/inputs/NumberField";
import { Checkbox } from "../../components/inputs/Checkbox";
import { FieldRow } from "../../components/inputs/FieldRow";
import { ErrorDrawer } from "../../components/feedback/ErrorDrawer";
import { Notice } from "../../components/feedback/Notice";
import { EmptyState } from "../../components/states/Empty.state";
import { Theme } from "../../theme/Theme.api";
import { clearFinished, enqueue, isActive, retryTask, setConcurrency, useQueue } from "../../core/queue/Queue.store";
import { TASK_PAGE_INVENTORY } from "../../core/queue/Queue.tasks";
import { useThrottleState } from "../../api/Throttle.api";
import { TaskCard } from "../../app/TaskCard";
import { QueueContent } from "./Queue.content";
import { taskDuration } from "./Queue.logic";
import { formatDateTime, formatNumber } from "../../utils/Format.util";
const QueuePage = () => {
    var _a, _b, _c;
    const { tasks, concurrency } = useQueue();
    const throttle = useThrottleState();
    const [maxPages, setMaxPages] = React.useState(200);
    const [saveReport, setSaveReport] = React.useState(true);
    const [errorTask, setErrorTask] = React.useState(undefined);
    const active = tasks.filter((task) => isActive(task.status));
    const finished = tasks.filter((task) => !isActive(task.status));
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: QueueContent.title, description: QueueContent.description, actions: React.createElement(Button, { label: QueueContent.clear, iconName: "Delete", onClick: clearFinished, disabled: finished.length === 0 }) }),
        React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 } },
            React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" } },
                React.createElement(StatTile, { label: QueueContent.stats.active, value: formatNumber(active.length), tone: active.length > 0 ? "info" : "neutral", badge: active.length > 0 ? QueueContent.stats.running : undefined }),
                React.createElement(StatTile, { label: QueueContent.stats.finished, value: formatNumber(finished.length) }),
                React.createElement(StatTile, { label: QueueContent.stats.inFlight, value: formatNumber(throttle.inFlight) }),
                React.createElement(StatTile, { label: QueueContent.stats.queuedRequests, value: formatNumber(throttle.queued) }),
                React.createElement(StatTile, { label: QueueContent.stats.retries, value: formatNumber(throttle.retries), tone: "warning", badge: throttle.status === "throttled" ? QueueContent.stats.throttled : undefined })),
            throttle.status === "throttled" && React.createElement(Notice, { tone: "warning", message: QueueContent.throttledNotice }),
            React.createElement(Card, { title: QueueContent.settingsTitle },
                React.createElement(FieldRow, null,
                    React.createElement(NumberField, { label: QueueContent.concurrency, value: concurrency, min: 1, max: 4, onChange: setConcurrency }))),
            React.createElement(Card, { title: QueueContent.demoTitle, subtitle: QueueContent.demoSubtitle },
                React.createElement(FieldRow, null,
                    React.createElement(NumberField, { label: QueueContent.maxPages, value: maxPages, min: 1, max: 5000, step: 50, onChange: setMaxPages }),
                    React.createElement(Checkbox, { label: QueueContent.saveReport, checked: saveReport, onChange: setSaveReport }),
                    React.createElement("div", null,
                        React.createElement(Button, { label: QueueContent.demoLabel, variant: "primary", iconName: "Play", onClick: () => enqueue({
                                kind: TASK_PAGE_INVENTORY,
                                label: "Site page inventory",
                                payload: { maxPages, saveReport },
                            }) })))),
            React.createElement("section", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
                React.createElement(Toolbar, { ariaLabel: QueueContent.activeTitle },
                    React.createElement("h2", { style: { margin: 0, fontSize: Theme.tokens.font.lg } }, QueueContent.activeTitle)),
                active.length === 0 ? (React.createElement(EmptyState, { title: QueueContent.empty.title, description: QueueContent.empty.description, iconName: "TaskManager" })) : (React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.md } }, active.map((task) => (React.createElement("li", { key: task.id },
                    React.createElement(TaskCard, { task: task, onViewError: setErrorTask }))))))),
            finished.length > 0 && (React.createElement("section", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
                React.createElement(Toolbar, { ariaLabel: QueueContent.historyTitle },
                    React.createElement("h2", { style: { margin: 0, fontSize: Theme.tokens.font.lg } }, QueueContent.historyTitle)),
                React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm } }, finished.map((task) => (React.createElement("li", { key: task.id },
                    React.createElement(TaskCard, { task: task, onViewError: setErrorTask, compact: true })))))))),
        React.createElement(ErrorDrawer, { open: Boolean(errorTask), title: (_a = errorTask === null || errorTask === void 0 ? void 0 : errorTask.label) !== null && _a !== void 0 ? _a : "", message: (_b = errorTask === null || errorTask === void 0 ? void 0 : errorTask.error) !== null && _b !== void 0 ? _b : "", context: errorTask
                ? [
                    { label: "Task", value: errorTask.kind },
                    { label: "Queued", value: formatDateTime(new Date(errorTask.queuedAt)) },
                    { label: "Duration", value: taskDuration(errorTask) },
                    { label: "Last step", value: (_c = errorTask.progress.message) !== null && _c !== void 0 ? _c : "-" },
                ]
                : undefined, onDismiss: () => setErrorTask(undefined), onRetry: errorTask
                ? () => {
                    retryTask(errorTask.id);
                    setErrorTask(undefined);
                }
                : undefined })));
};
export default QueuePage;
//# sourceMappingURL=Queue.page.js.map