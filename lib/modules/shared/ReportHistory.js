import { __awaiter } from "tslib";
import * as React from "react";
import { Card } from "../../components/layout/Card";
import { Modal } from "../../components/actions/Modal";
import { Notice } from "../../components/feedback/Notice";
import { Table } from "../../components/data/Table";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { AsyncBoundary } from "../../components/states/AsyncBoundary";
import { useAsync } from "../../core/hooks/useAsync";
import { useApp } from "../../core/context/App.context";
import { Reports, reportFolderUrl } from "../../api/Reports.api";
import { Theme } from "../../theme/Theme.api";
import { durationBetween, formatDateTime } from "../../utils/Format.util";
import { toErrorMessage } from "../../utils/Guard.util";
export const ReportHistory = ({ kind, title, newLabel, onNew, onOpen, onResume, busy, onImport, error, onDismissError, }) => {
    const fileInput = React.useRef(null);
    const { access } = useApp();
    const [pendingDelete, setPendingDelete] = React.useState(undefined);
    // A large run takes seconds to read, so the row that was clicked says so.
    const [opening, setOpening] = React.useState(undefined);
    const [deleteError, setDeleteError] = React.useState(undefined);
    const entries = useAsync(() => __awaiter(void 0, void 0, void 0, function* () { return (yield Reports().index()).filter((entry) => entry.kind === kind); }), {
        deps: [kind],
    });
    const urlOf = (entry) => `${reportFolderUrl()}/${entry.fileName}`;
    const run = (entry, action) => {
        setOpening(entry.id);
        Promise.resolve(action(urlOf(entry)))
            .then(() => setOpening(undefined))
            .catch(() => setOpening(undefined));
    };
    const remove = (entry) => {
        setPendingDelete(undefined);
        setDeleteError(undefined);
        Reports()
            .remove(urlOf(entry))
            .then(entries.reload)
            .catch((failure) => {
            setDeleteError(toErrorMessage(failure));
            entries.reload();
        });
    };
    const owns = (entry) => Boolean(entry.createdByLogin) &&
        entry.createdByLogin.toLowerCase() === access.user.loginName.toLowerCase();
    const columns = [
        {
            key: "updated",
            header: "Run",
            minWidth: 190,
            sortValue: (entry) => entry.updatedIso,
            render: (entry) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600 } }, entry.title || formatDateTime(entry.updatedIso)),
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm } }, formatDateTime(entry.updatedIso)),
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } },
                    "v",
                    entry.version,
                    " \u00B7 ",
                    entry.sites.length,
                    " site(s)"))),
        },
        {
            key: "site",
            header: "Site",
            minWidth: 200,
            sortValue: (entry) => { var _a; return (_a = entry.sites[0]) !== null && _a !== void 0 ? _a : ""; },
            filterValue: (entry) => { var _a; return siteName((_a = entry.sites[0]) !== null && _a !== void 0 ? _a : ""); },
            render: (entry) => (React.createElement("span", { title: entry.sites.join(", ") }, entry.sites.map(siteName).join(", ") || "-")),
        },
        {
            key: "status",
            header: "Status",
            minWidth: 130,
            sortValue: (entry) => entry.status,
            filterValue: (entry) => entry.status,
            render: (entry) => React.createElement(StatusBadge, { status: statusOf(entry.status) }),
        },
        {
            key: "duration",
            header: "Duration",
            minWidth: 110,
            sortValue: (entry) => new Date(entry.updatedIso).getTime() - new Date(entry.createdIso).getTime(),
            render: (entry) => React.createElement("span", null, durationBetween(entry.createdIso, entry.updatedIso)),
        },
        {
            key: "createdBy",
            header: "Run by",
            minWidth: 160,
            sortValue: (entry) => entry.createdBy,
            filterValue: (entry) => entry.createdBy || "Unknown",
            render: (entry) => React.createElement("span", null, entry.createdBy || "Unknown"),
        },
        {
            key: "issues",
            header: "Issues",
            minWidth: 90,
            sortValue: (entry) => entry.issues,
            render: (entry) => (React.createElement(Badge, { label: String(entry.issues), tone: entry.issues > 0 ? "warning" : "neutral", showIcon: false })),
        },
        {
            key: "actions",
            header: "Actions",
            minWidth: 300,
            render: (entry) => (React.createElement("div", { style: { display: "flex", gap: 4 } },
                React.createElement(Button, { label: opening === entry.id ? "Opening" : "Open", variant: "subtle", iconName: "OpenFile", busy: opening === entry.id, disabled: busy || Boolean(opening), onClick: () => run(entry, onOpen) }),
                entry.status !== "complete" && owns(entry) && (React.createElement(Button, { label: "Resume", variant: "subtle", iconName: "Play", busy: opening === entry.id, disabled: busy || Boolean(opening), onClick: () => run(entry, onResume) })),
                React.createElement(Button, { label: "Delete", variant: "subtle", iconName: "Delete", disabled: busy, onClick: () => setPendingDelete(entry) }))),
        },
    ];
    return (React.createElement(Card, { title: title, actions: React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.sm } },
            React.createElement(Button, { label: "Refresh", iconName: "Refresh", onClick: entries.reload }),
            onImport && (React.createElement(Button, { label: "Import JSON", iconName: "Upload", onClick: () => { var _a; return (_a = fileInput.current) === null || _a === void 0 ? void 0 : _a.click(); } })),
            React.createElement(Button, { label: newLabel, variant: "primary", iconName: "Add", onClick: onNew, disabled: busy })) },
        onImport && (React.createElement("input", { ref: fileInput, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => {
                var _a;
                const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                // Clearing the value lets the same file be picked twice in a row.
                event.target.value = "";
                if (file)
                    onImport(file);
            } })),
        error && React.createElement(Notice, { tone: "error", message: error, onDismiss: onDismissError }),
        deleteError && React.createElement(Notice, { tone: "error", message: deleteError, onDismiss: () => setDeleteError(undefined) }),
        React.createElement(AsyncBoundary, { result: entries, empty: {
                title: "No previous runs",
                description: "Start a new audit to create the first report.",
                iconName: "ReportDocument",
                actionLabel: newLabel,
                onAction: onNew,
            } }, (rows) => (React.createElement(Table, { ariaLabel: title, rows: rows, columns: columns, getRowKey: (entry) => entry.id, initialSortKey: "updated", initialSortDescending: true }))),
        React.createElement(Modal, { open: Boolean(pendingDelete), title: "Delete this run?", description: "The report file is sent to the site recycle bin. The pages it audited are untouched.", onDismiss: () => setPendingDelete(undefined), footer: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: "Delete run", variant: "danger", onClick: () => (pendingDelete ? remove(pendingDelete) : undefined) }),
                React.createElement(Button, { label: "Keep", onClick: () => setPendingDelete(undefined) })) },
            React.createElement("p", { style: { margin: 0 } }, pendingDelete ? formatDateTime(pendingDelete.updatedIso) : ""))));
};
/** The last path segment is what people call the site; the rest is noise in a table. */
function siteName(url) {
    if (!url)
        return "";
    const parts = url.replace(/\/$/, "").split("/");
    return parts[parts.length - 1] || url;
}
function statusOf(status) {
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
//# sourceMappingURL=ReportHistory.js.map