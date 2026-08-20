import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { Table } from "../../components/data/Table";
import { Tabs } from "../../components/data/Tabs";
import { EmptyState } from "../../components/states/Empty.state";
import { Theme } from "../../theme/Theme.api";
import { durationBetween, formatDateTime } from "../../utils/Format.util";
import { TextField } from "../../components/inputs/TextField";
import { Reports } from "../../api/Reports.api";
import { downloadJson } from "../../utils/Export.util";
export const ReportDetails = ({ open, onDismiss, envelope, definition, logsEnabled, initialTab, }) => {
    var _a, _b, _c, _d, _e;
    const [tab, setTab] = React.useState(initialTab !== null && initialTab !== void 0 ? initialTab : "settings");
    const [name, setName] = React.useState(undefined);
    const [saving, setSaving] = React.useState(false);
    React.useEffect(() => {
        if (open)
            setTab(initialTab !== null && initialTab !== void 0 ? initialTab : "settings");
    }, [open, initialTab]);
    if (!envelope)
        return null;
    const run = envelope;
    const title = name !== null && name !== void 0 ? name : run.title;
    /** The file keeps its id, so renaming is only ever a label change. */
    const rename = () => {
        setSaving(true);
        run.title = title;
        Reports()
            .save(run)
            .then(() => setSaving(false))
            .catch(() => setSaving(false));
    };
    const config = ((_a = run.config) !== null && _a !== void 0 ? _a : {});
    const settings = definition.configFields.map((field) => ({
        key: field.key,
        label: field.label,
        value: format(config[field.key]),
    }));
    return (React.createElement(PreviewDialog, { open: open, onDismiss: onDismiss, title: `${run.title}: run details`, description: "Settings used for this run, plus the log and issues captured while it ran.", width: "large", facts: [
            { label: "Status", value: React.createElement(StatusBadge, { status: runStatus(run.status) }) },
            { label: "Started", value: formatDateTime(run.createdIso) },
            { label: "Updated", value: formatDateTime(run.updatedIso) },
            { label: "Run by", value: run.createdBy || "Unknown" },
            { label: "Report version", value: `v${run.version}` },
            {
                label: "Duration",
                value: durationBetween(run.createdIso, run.status === "running" ? undefined : run.updatedIso),
            },
            { label: "Sites", value: run.sites.join(", ") || "-" },
        ], actions: React.createElement(React.Fragment, null,
            React.createElement(Button, { label: "Export report JSON", iconName: "Download", onClick: () => downloadJson(`${run.kind}-${run.id}`, run) }),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })) },
        React.createElement("div", { style: {
                display: "flex",
                gap: Theme.tokens.space.sm,
                alignItems: "flex-end",
                flexWrap: "wrap",
                marginBottom: Theme.tokens.space.md,
            } },
            React.createElement("div", { style: { flex: "1 1 320px", minWidth: 240 } },
                React.createElement(TextField, { label: "Report name", value: title, onChange: setName })),
            React.createElement(Button, { label: "Rename", iconName: "Save", variant: "primary", busy: saving, disabled: title.trim().length === 0 || title === run.title, onClick: rename })),
        React.createElement(Tabs, { ariaLabel: "Run details", selectedKey: tab, onChange: setTab, items: [
                {
                    key: "settings",
                    label: "Settings used",
                    content: (React.createElement("dl", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                            gap: Theme.tokens.space.md,
                            margin: 0,
                        } }, settings.map((setting) => (React.createElement("div", { key: setting.key },
                        React.createElement("dt", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, setting.label),
                        React.createElement("dd", { style: { margin: "2px 0 0", fontWeight: 600 } }, setting.value)))))),
                },
                {
                    key: "stages",
                    label: "Stages",
                    count: run.stages.length,
                    content: (React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm } }, run.stages.map((stage) => (React.createElement("li", { key: stage.key, style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: Theme.tokens.space.sm,
                            padding: Theme.tokens.space.sm,
                            border: `1px solid ${Theme.palette().border}`,
                            borderRadius: Theme.tokens.radius.sm,
                        } },
                        React.createElement("span", null, stage.label),
                        React.createElement("span", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm } },
                            React.createElement("span", { style: { color: Theme.palette().textMuted, fontSize: Theme.tokens.font.sm } },
                                stage.total
                                    ? `${stage.processed.toLocaleString()}/${stage.total.toLocaleString()}`
                                    : stage.processed.toLocaleString(),
                                stage.startedIso ? ` · ${durationBetween(stage.startedIso, stage.finishedIso)}` : ""),
                            React.createElement(StatusBadge, { status: stage.status }))))))),
                },
                {
                    key: "issues",
                    label: "Issues",
                    count: run.issues.length,
                    content: run.issues.length === 0 ? (React.createElement(EmptyState, { title: "No issues", description: "Targets that returned 401, 403, 429 or an error would be listed here.", iconName: "ShieldAlert" })) : (React.createElement(Table, { ariaLabel: "Issues", rows: run.issues, getRowKey: (issue) => `${issue.iso}-${issue.target}`, columns: issueColumns, searchValue: (issue) => `${issue.stage} ${issue.target} ${issue.message}`, searchLabel: "Search issues", initialSortKey: "iso", initialSortDescending: true, maxHeight: 360 })),
                },
                {
                    key: "log",
                    label: "Log",
                    count: (_c = (_b = run.logs) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0,
                    content: !logsEnabled ? (React.createElement(EmptyState, { title: "Logging is off", description: "Turn on report logging in Settings to capture a run log.", iconName: "DiagnosticDataBarTooltip" })) : ((_d = run.logs) !== null && _d !== void 0 ? _d : []).length === 0 ? (React.createElement(EmptyState, { title: "No log entries", description: "Entries appear as the report runs." })) : (React.createElement(React.Fragment, null,
                        React.createElement(Table, { ariaLabel: "Run log", rows: (_e = run.logs) !== null && _e !== void 0 ? _e : [], getRowKey: (entry) => `${entry.iso}-${entry.message}`, columns: logColumns, searchValue: (entry) => `${entry.stage} ${entry.level} ${entry.message}`, searchLabel: "Search log", initialSortKey: "iso", initialSortDescending: true, maxHeight: 360 }),
                        React.createElement("div", { style: { marginTop: Theme.tokens.space.sm } },
                            React.createElement(Button, { label: "Export log", iconName: "Download", onClick: () => { var _a; return downloadJson(`report-log-${run.id}`, (_a = run.logs) !== null && _a !== void 0 ? _a : []); } })))),
                },
            ] })));
};
const issueColumns = [
    {
        key: "iso",
        header: "When",
        minWidth: 170,
        sortValue: (issue) => issue.iso,
        render: (issue) => React.createElement("span", null, formatDateTime(issue.iso)),
    },
    {
        key: "stage",
        header: "Stage",
        minWidth: 130,
        sortValue: (issue) => issue.stage,
        filterValue: (issue) => issue.stage,
        render: (issue) => React.createElement("span", null, issue.stage),
    },
    {
        key: "target",
        header: "Target",
        minWidth: 200,
        sortValue: (issue) => issue.target,
        render: (issue) => React.createElement("span", null, issue.target),
    },
    {
        key: "code",
        header: "Code",
        minWidth: 100,
        sortValue: (issue) => String(issue.code),
        filterValue: (issue) => String(issue.code),
        render: (issue) => (React.createElement(Badge, { label: String(issue.code), tone: issue.code === 401 || issue.code === 403 ? "danger" : "warning" })),
    },
    {
        key: "message",
        header: "Detail",
        minWidth: 260,
        maxWidth: 420,
        sortValue: (issue) => issue.message,
        render: (issue) => React.createElement("span", null, issue.message),
    },
];
const logColumns = [
    {
        key: "iso",
        header: "Time",
        minWidth: 170,
        sortValue: (entry) => entry.iso,
        render: (entry) => React.createElement("span", null, formatDateTime(entry.iso)),
    },
    {
        key: "level",
        header: "Level",
        minWidth: 110,
        sortValue: (entry) => entry.level,
        filterValue: (entry) => entry.level,
        render: (entry) => (React.createElement(Badge, { label: entry.level, tone: entry.level === "error" ? "danger" : entry.level === "warn" ? "warning" : "info" })),
    },
    {
        key: "stage",
        header: "Stage",
        minWidth: 140,
        sortValue: (entry) => entry.stage,
        filterValue: (entry) => entry.stage,
        render: (entry) => React.createElement("span", null, entry.stage),
    },
    {
        key: "message",
        header: "Message",
        minWidth: 320,
        maxWidth: 520,
        sortValue: (entry) => entry.message,
        render: (entry) => React.createElement("span", null, entry.message),
    },
];
function runStatus(status) {
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
function format(value) {
    if (typeof value === "boolean")
        return value ? "On" : "Off";
    if (value === undefined || value === null || value === "")
        return "-";
    return String(value);
}
//# sourceMappingURL=ReportDetails.js.map