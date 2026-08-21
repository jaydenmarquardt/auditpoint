import * as React from "react";
import { Button } from "../../components/actions/Button";
import { MenuButton } from "../../components/actions/MenuButton";
import { ProgressGroup } from "../../components/feedback/ProgressGroup";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { Notice } from "../../components/feedback/Notice";
import { Toolbar } from "../../components/layout/Toolbar";
import { Modal } from "../../components/actions/Modal";
import { ReportDetails } from "./ReportDetails";
import { getSettings, useSettings } from "../../api/Settings.api";
import { Dropdown } from "../../components/inputs/Dropdown";
import { NumberField } from "../../components/inputs/NumberField";
import { FieldRow } from "../../components/inputs/FieldRow";
import { configureThrottle } from "../../api/Throttle.api";
import { Theme } from "../../theme/Theme.api";
import { useThrottleState } from "../../api/Throttle.api";
import { durationBetween, estimateRemaining, formatDateTime } from "../../utils/Format.util";
import { downloadJson } from "../../utils/Export.util";
export const ReportRunPanel = ({ title, controller, runLabel, extraControls, menuItems = [], runDisabled, configPanel, configOpen, onConfigOpenChange, onBack, backLabel = "All runs", definition, }) => {
    var _a, _b, _c;
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const logsEnabled = useSettings((settings) => settings.captureReportLogs);
    const throttle = useThrottleState();
    const [internalOpen, setInternalOpen] = React.useState(false);
    const fileInput = React.useRef(null);
    const sites = useSettings((settings) => settings.sites);
    // A run reads one site: several at once made every count ambiguous.
    const [site, setSite] = React.useState(() => { var _a, _b; return (_b = (_a = getSettings().sites[0]) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : ""; });
    const [concurrency, setConcurrency] = React.useState(() => getSettings().concurrency);
    const [saved, setSaved] = React.useState(false);
    const startRun = () => {
        configureThrottle({ concurrency });
        controller.start(site ? [site] : undefined);
    };
    const open = configOpen !== null && configOpen !== void 0 ? configOpen : internalOpen;
    const setOpen = (next) => {
        setInternalOpen(next);
        if (onConfigOpenChange)
            onConfigOpenChange(next);
    };
    const envelope = controller.envelope;
    const steps = ((_a = envelope === null || envelope === void 0 ? void 0 : envelope.stages) !== null && _a !== void 0 ? _a : []).map((stage) => {
        var _a;
        return ({
            key: stage.key,
            label: stage.label,
            work: (_a = definition === null || definition === void 0 ? void 0 : definition.stages.find((entry) => entry.key === stage.key)) === null || _a === void 0 ? void 0 : _a.work,
            status: stage.status,
            ratio: stage.total ? stage.processed / stage.total : undefined,
            countLabel: countLabel(stage),
            message: stage.error,
        });
    });
    const done = steps.filter((step) => step.status === "succeeded").length;
    const overall = steps.length === 0 ? undefined : done / steps.length;
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
        (envelope || controller.running) && (React.createElement(Toolbar, { ariaLabel: `${title} controls` },
            onBack && React.createElement(Button, { label: backLabel, iconName: "ChevronLeft", onClick: onBack }),
            !controller.running && (React.createElement(Button, { label: envelope ? runLabel.rerun : runLabel.run, variant: "primary", iconName: "Play", onClick: () => (configPanel ? setOpen(true) : controller.start()), disabled: runDisabled })),
            controller.running && React.createElement(Button, { label: runLabel.pause, iconName: "Pause", onClick: controller.pause }),
            controller.paused && React.createElement(Button, { label: runLabel.resume, iconName: "Play", onClick: controller.resume }),
            (controller.running || controller.paused) && (React.createElement(Button, { label: runLabel.cancel, variant: "subtle", iconName: "Cancel", onClick: controller.cancel })),
            envelope && !controller.running && !controller.paused && RESUMABLE.indexOf(envelope.status) !== -1 && (React.createElement(Button, { label: runLabel.resume, variant: "primary", iconName: "Refresh", onClick: controller.resume })),
            extraControls,
            React.createElement("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: Theme.tokens.space.sm } },
                React.createElement(MenuButton, { label: "More", items: [
                        ...menuItems,
                        {
                            key: "details",
                            label: controller.running ? "Live log" : "Run details",
                            iconName: controller.running ? "TimeEntry" : "Info",
                            disabled: !envelope || !definition,
                            onClick: () => setDetailsOpen(true),
                        },
                        {
                            key: "export",
                            label: "Export JSON",
                            iconName: "Download",
                            disabled: !envelope,
                            onClick: () => (envelope ? downloadJson(`${envelope.kind}-${envelope.id}`, envelope) : undefined),
                        },
                        {
                            key: "import",
                            label: "Import JSON",
                            iconName: "Upload",
                            onClick: () => { var _a; return (_a = fileInput.current) === null || _a === void 0 ? void 0 : _a.click(); },
                        },
                    ] }),
                envelope && React.createElement(StatusBadge, { status: mapRunStatus(envelope.status) })))),
        (envelope === null || envelope === void 0 ? void 0 : envelope.status) === "interrupted" && (React.createElement(Notice, { tone: "warning", message: "This run stopped before it finished, most likely because its page was closed. Resume picks it up from the last completed stage." })),
        envelope && (React.createElement("div", { style: {
                display: "flex",
                flexWrap: "wrap",
                gap: `2px ${Theme.tokens.space.md}`,
                fontSize: Theme.tokens.font.sm,
                color: Theme.palette().textMuted,
                minWidth: 0,
            } },
            React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis" } },
                React.createElement("i", { className: "ms-Icon ms-Icon--Website", "aria-hidden": "true" }),
                " ",
                ((_b = envelope.sites) !== null && _b !== void 0 ? _b : []).join(", ") || "This site"),
            React.createElement("span", null,
                React.createElement("i", { className: "ms-Icon ms-Icon--Clock", "aria-hidden": "true" }),
                " ",
                formatDateTime(envelope.updatedIso)),
            React.createElement("span", null,
                React.createElement("i", { className: "ms-Icon ms-Icon--Contact", "aria-hidden": "true" }),
                " ",
                envelope.createdBy || "Unknown"),
            React.createElement("span", null,
                React.createElement("i", { className: "ms-Icon ms-Icon--Tag", "aria-hidden": "true" }),
                " v",
                envelope.version))),
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
        definition && (React.createElement(ReportDetails, { open: detailsOpen, initialTab: controller.running ? "log" : "settings", onDismiss: () => setDetailsOpen(false), envelope: envelope, definition: definition, logsEnabled: logsEnabled })),
        configPanel && (React.createElement(Modal, { open: open, title: (_c = runLabel.configTitle) !== null && _c !== void 0 ? _c : "Audit settings", width: "large", onDismiss: () => setOpen(false), footer: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: runLabel.run, variant: "primary", iconName: "Play", onClick: () => {
                        setOpen(false);
                        setSaved(false);
                        startRun();
                    } }),
                React.createElement(Button, { label: saved ? "Saved" : "Save as default", iconName: "Save", onClick: () => {
                        controller.saveConfigAsDefault();
                        setSaved(true);
                    } }),
                React.createElement(Button, { label: "Reset", iconName: "Undo", onClick: () => { controller.resetConfig(); setSaved(false); } }),
                React.createElement(Button, { label: runLabel.cancel, onClick: () => setOpen(false) })) },
            React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
                React.createElement(FieldRow, null,
                    React.createElement(Dropdown, { label: "Site to audit", options: sites.map((target) => ({ key: target.url, text: target.title || target.url })), selectedKey: site, onChange: setSite }),
                    React.createElement(NumberField, { label: "Parallel requests", value: concurrency, min: 1, max: 12, onChange: setConcurrency })),
                React.createElement("div", { style: { maxHeight: "52vh", overflowY: "auto", paddingRight: Theme.tokens.space.xs } }, configPanel)))),
        envelope && (React.createElement(ProgressGroup, { label: title, status: mapRunStatus(envelope.status), ratio: overall, steps: steps, description: `Updated ${formatDateTime(envelope.updatedIso)} · ${envelope.issues.length} issues · ${throttle.inFlight} in flight` }))));
};
/** Statuses a run can be picked up from, rather than started again from nothing. */
const RESUMABLE = ["failed", "interrupted", "paused", "running"];
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
    if (status === "interrupted")
        return "interrupted";
    if (status === "running")
        return "running";
    return "pending";
}
//# sourceMappingURL=ReportRunPanel.js.map