import * as React from "react";
import { Button } from "../../components/actions/Button";
import { ProgressGroup } from "../../components/feedback/ProgressGroup";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { Notice } from "../../components/feedback/Notice";
import { Toolbar } from "../../components/layout/Toolbar";
import { Modal } from "../../components/actions/Modal";
import { ReportDetails } from "./ReportDetails";
import { useSettings } from "../../api/Settings.api";
import { Theme } from "../../theme/Theme.api";
import { useThrottleState } from "../../api/Throttle.api";
import { durationBetween, estimateRemaining, formatDateTime } from "../../utils/Format.util";
import { downloadJson } from "../../utils/Export.util";
export const ReportRunPanel = ({ title, controller, runLabel, extraControls, runDisabled, configPanel, configOpen, onConfigOpenChange, onBack, backLabel = "All runs", definition, }) => {
    var _a, _b;
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const logsEnabled = useSettings((settings) => settings.captureReportLogs);
    const throttle = useThrottleState();
    const [internalOpen, setInternalOpen] = React.useState(false);
    const fileInput = React.useRef(null);
    const open = configOpen !== null && configOpen !== void 0 ? configOpen : internalOpen;
    const setOpen = (next) => {
        setInternalOpen(next);
        if (onConfigOpenChange)
            onConfigOpenChange(next);
    };
    const envelope = controller.envelope;
    const steps = ((_a = envelope === null || envelope === void 0 ? void 0 : envelope.stages) !== null && _a !== void 0 ? _a : []).map((stage) => ({
        key: stage.key,
        label: stage.label,
        status: stage.status,
        ratio: stage.total ? stage.processed / stage.total : undefined,
        countLabel: countLabel(stage),
        message: stage.error,
    }));
    const done = steps.filter((step) => step.status === "succeeded").length;
    const overall = steps.length === 0 ? undefined : done / steps.length;
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
        (envelope || controller.running) && (React.createElement(Toolbar, { ariaLabel: `${title} controls` },
            onBack && React.createElement(Button, { label: backLabel, iconName: "ChevronLeft", onClick: onBack }),
            !controller.running && (React.createElement(Button, { label: envelope ? runLabel.rerun : runLabel.run, variant: "primary", iconName: "Play", onClick: () => (configPanel ? setOpen(true) : controller.start()), disabled: runDisabled })),
            controller.running && React.createElement(Button, { label: runLabel.pause, iconName: "Pause", onClick: controller.pause }),
            controller.paused && React.createElement(Button, { label: runLabel.resume, iconName: "Play", onClick: controller.resume }),
            (controller.running || controller.paused) && (React.createElement(Button, { label: runLabel.cancel, variant: "subtle", iconName: "Cancel", onClick: controller.cancel })),
            envelope && envelope.status === "failed" && (React.createElement(Button, { label: runLabel.resume, variant: "primary", iconName: "Refresh", onClick: controller.resume })),
            envelope && (React.createElement(Button, { label: "Export JSON", iconName: "Download", onClick: () => downloadJson(`${envelope.kind}-${envelope.id}`, envelope) })),
            React.createElement(Button, { label: "Import JSON", iconName: "Upload", onClick: () => { var _a; return (_a = fileInput.current) === null || _a === void 0 ? void 0 : _a.click(); } }),
            extraControls,
            envelope && definition && (React.createElement(Button, { label: "Run details", iconName: "Info", onClick: () => setDetailsOpen(true) })),
            envelope && React.createElement(StatusBadge, { status: mapRunStatus(envelope.status) }),
            envelope && (React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } },
                formatDateTime(envelope.updatedIso),
                " \u00B7 v",
                envelope.version,
                " \u00B7 ",
                envelope.createdBy)))),
        React.createElement("input", { ref: fileInput, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => {
                var _a;
                const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                // Clearing the value lets the same file be picked twice in a row.
                event.target.value = "";
                if (file)
                    void controller.importJson(file);
            } }),
        controller.error && (React.createElement(Notice, { tone: "error", message: controller.error, onDismiss: controller.clearError })),
        throttle.status === "throttled" && (React.createElement(Notice, { tone: "warning", message: "SharePoint is throttling requests. Backing off and retrying automatically." })),
        definition && (React.createElement(ReportDetails, { open: detailsOpen, onDismiss: () => setDetailsOpen(false), envelope: envelope, definition: definition, logsEnabled: logsEnabled })),
        configPanel && (React.createElement(Modal, { open: open, title: (_b = runLabel.configTitle) !== null && _b !== void 0 ? _b : "Audit settings", width: "large", onDismiss: () => setOpen(false), footer: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: runLabel.run, variant: "primary", iconName: "Play", onClick: () => {
                        setOpen(false);
                        controller.start();
                    } }),
                React.createElement(Button, { label: runLabel.cancel, onClick: () => setOpen(false) })) }, configPanel)),
        envelope && (React.createElement(ProgressGroup, { label: title, status: mapRunStatus(envelope.status), ratio: overall, steps: steps, description: `Updated ${formatDateTime(envelope.updatedIso)} · ${envelope.issues.length} issues · ${throttle.inFlight} in flight` }))));
};
function countLabel(stage) {
    if (!stage.total)
        return stage.status === "succeeded" ? durationBetween(stage.startedIso, stage.finishedIso) : undefined;
    const counts = `${stage.processed.toLocaleString()}/${stage.total.toLocaleString()}`;
    if (stage.status === "running") {
        const eta = estimateRemaining(stage.startedIso, stage.processed, stage.total);
        return eta ? `${counts} · ${eta} left` : counts;
    }
    if (stage.status === "succeeded")
        return `${counts} · ${durationBetween(stage.startedIso, stage.finishedIso)}`;
    return counts;
}
function mapRunStatus(status) {
    if (status === "complete")
        return "succeeded";
    if (status === "failed")
        return "failed";
    if (status === "paused")
        return "paused";
    if (status === "cancelled")
        return "cancelled";
    if (status === "running")
        return "running";
    return "pending";
}
//# sourceMappingURL=ReportRunPanel.js.map