import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Button } from "../../components/actions/Button";
import { Drawer } from "../../components/actions/Drawer";
import { Dropdown } from "../../components/inputs/Dropdown";
import { Modal } from "../../components/actions/Modal";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchBox } from "../../components/inputs/SearchBox";
import { Table } from "../../components/data/Table";
import { Toolbar } from "../../components/layout/Toolbar";
import { AsyncBoundary } from "../../components/states/AsyncBoundary";
import { LoadingState } from "../../components/states/Loading.state";
import { ProgressGroup } from "../../components/feedback/ProgressGroup";
import { StatusBadge } from "../../components/feedback/StatusBadge";
import { getReportDefinition, resumeSavedEnvelope } from "../../core/report/Report.store";
import { navigate } from "../../core/state/App.store";
import { MODULES } from "../../modules/Modules.registry";
import { useAsync } from "../../core/hooks/useAsync";
import { Reports } from "../../api/Reports.api";
import { getWebUrl } from "../../api/Sp.api";
import { formatBytes, formatDateTime } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
import { toErrorMessage } from "../../utils/Guard.util";
import { ReportsContent } from "./Reports.content";
import { filterReports, kindLabel, kindOptions, visibleReports } from "./Reports.logic";
import { useApp } from "../../core/context/App.context";
import { Tokens } from "../../theme/Tokens";
const ReportsPage = () => {
    var _a, _b;
    const reports = useAsync(() => Reports().list());
    const { access } = useApp();
    const userLogin = access.user.loginName;
    const [search, setSearch] = React.useState("");
    const [kind, setKind] = React.useState("all");
    const [preview, setPreview] = React.useState(undefined);
    const [previewBody, setPreviewBody] = React.useState(undefined);
    const [previewEnvelope, setPreviewEnvelope] = React.useState(undefined);
    const [pendingDelete, setPendingDelete] = React.useState(undefined);
    const openPreview = (report) => {
        setPreview(report);
        setPreviewBody(undefined);
        setPreviewEnvelope(undefined);
        Reports()
            .read(report.serverRelativeUrl)
            .then((envelope) => {
            setPreviewEnvelope(envelope);
            setPreviewBody(JSON.stringify(envelope, null, 2));
        })
            .catch((error) => setPreviewBody(toErrorMessage(error)));
    };
    const confirmDelete = () => {
        if (!pendingDelete)
            return;
        const target = pendingDelete;
        setPendingDelete(undefined);
        Reports()
            .remove(target.serverRelativeUrl)
            .then(() => reports.reload())
            .catch(() => reports.reload());
    };
    const columns = [
        {
            key: "name",
            header: ReportsContent.columns.name,
            minWidth: 240,
            maxWidth: 360,
            sortValue: (report) => report.name,
            render: (report) => React.createElement("span", { style: { fontWeight: 600 } }, report.name),
        },
        {
            key: "kind",
            header: ReportsContent.columns.kind,
            minWidth: 150,
            sortValue: (report) => report.kind,
            filterValue: (report) => kindLabel(report.kind),
            render: (report) => React.createElement(Badge, { label: kindLabel(report.kind), tone: "info" }),
        },
        {
            key: "status",
            header: ReportsContent.columns.status,
            minWidth: 120,
            sortValue: (report) => report.status,
            filterValue: (report) => report.status,
            render: (report) => React.createElement(StatusBadge, { status: runStatus(report.status) }),
        },
        {
            key: "createdBy",
            header: ReportsContent.columns.createdBy,
            minWidth: 150,
            sortValue: (report) => report.createdBy,
            filterValue: (report) => report.createdBy || ReportsContent.unknownUser,
            render: (report) => React.createElement("span", null, report.createdBy || ReportsContent.unknownUser),
        },
        {
            key: "modified",
            header: ReportsContent.columns.modified,
            minWidth: 170,
            sortValue: (report) => report.modified,
            render: (report) => React.createElement("span", null, formatDateTime(report.modified)),
        },
        {
            key: "size",
            header: ReportsContent.columns.size,
            minWidth: 100,
            sortValue: (report) => report.sizeBytes,
            render: (report) => React.createElement("span", null, formatBytes(report.sizeBytes)),
        },
        {
            key: "actions",
            header: ReportsContent.columns.actions,
            minWidth: 220,
            render: (report) => (React.createElement("div", { style: { display: "flex", gap: Tokens.space.xs } },
                React.createElement(Button, { label: ReportsContent.open, variant: "subtle", onClick: () => openPreview(report) }),
                React.createElement(Button, { label: ReportsContent.download, variant: "subtle", href: absoluteFromServerRelative(report.serverRelativeUrl, getWebUrl()) }),
                React.createElement(Button, { label: ReportsContent.delete, variant: "subtle", onClick: () => setPendingDelete(report) }))),
        },
    ];
    return (React.createElement(React.Fragment, null,
        React.createElement(PageHeader, { title: ReportsContent.title, description: ReportsContent.description, actions: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: ReportsContent.openFolder, iconName: "FolderHorizontal", newTab: true, href: absoluteFromServerRelative(Reports().folderUrl(), getWebUrl()) }),
                React.createElement(Button, { label: ReportsContent.refresh, iconName: "Refresh", onClick: reports.reload })) }),
        React.createElement(Toolbar, { ariaLabel: "Report filters" },
            React.createElement(SearchBox, { label: ReportsContent.search, value: search, onChange: setSearch }),
            React.createElement("div", { style: { minWidth: 200 } },
                React.createElement(Dropdown, { label: ReportsContent.filterKind, options: kindOptions((_a = reports.data) !== null && _a !== void 0 ? _a : []), selectedKey: kind, onChange: setKind }))),
        React.createElement(AsyncBoundary, { result: reports, empty: {
                title: ReportsContent.empty.title,
                description: ReportsContent.empty.description,
                iconName: "ReportDocument",
            } }, (data) => (React.createElement(Table, { ariaLabel: ReportsContent.title, columns: columns, rows: filterReports(visibleReports(data, userLogin), search, kind), getRowKey: (report) => report.serverRelativeUrl, initialSortKey: "modified", initialSortDescending: true }))),
        React.createElement(Drawer, { open: Boolean(preview), title: (_b = preview === null || preview === void 0 ? void 0 : preview.name) !== null && _b !== void 0 ? _b : "", width: "large", onDismiss: () => setPreview(undefined) },
            previewEnvelope && (React.createElement("div", { style: { display: "grid", gap: Tokens.space.md, marginBottom: Tokens.space.md } },
                React.createElement("div", { style: { display: "flex", gap: Tokens.space.sm, alignItems: "center", flexWrap: "wrap" } },
                    React.createElement(StatusBadge, { status: runStatus(previewEnvelope.status) }),
                    React.createElement("span", { style: { color: Tokens.colour.textMuted } },
                        previewEnvelope.issues.length,
                        " issues"),
                    previewEnvelope.status !== "complete" && !ownsEnvelope(previewEnvelope, userLogin) && (React.createElement("span", { style: { color: Tokens.colour.textMuted } },
                        ReportsContent.notYours,
                        " ",
                        previewEnvelope.createdBy)),
                    canResume(previewEnvelope) && ownsEnvelope(previewEnvelope, userLogin) && (React.createElement(Button, { label: ReportsContent.resume, variant: "primary", iconName: "Play", onClick: () => {
                            resumeSavedEnvelope(previewEnvelope);
                            const app = MODULES.find((entry) => { var _a; return ((_a = entry.report) === null || _a === void 0 ? void 0 : _a.kind) === previewEnvelope.kind; });
                            setPreview(undefined);
                            if (app)
                                navigate(app.key);
                        } }))),
                React.createElement(ProgressGroup, { label: previewEnvelope.title, status: runStatus(previewEnvelope.status), steps: previewEnvelope.stages.map(toStep) }))),
            previewBody === undefined ? (React.createElement(LoadingState, null)) : (React.createElement("pre", { style: {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: Tokens.font.sm,
                    background: Tokens.colour.surfaceAlt,
                    padding: Tokens.space.md,
                    borderRadius: Tokens.radius.sm,
                } }, previewBody))),
        React.createElement(Modal, { open: Boolean(pendingDelete), title: ReportsContent.deleteTitle, description: ReportsContent.deleteBody, onDismiss: () => setPendingDelete(undefined), footer: React.createElement(React.Fragment, null,
                React.createElement(Button, { label: ReportsContent.confirm, variant: "danger", onClick: confirmDelete }),
                React.createElement(Button, { label: ReportsContent.cancel, onClick: () => setPendingDelete(undefined) })) })));
};
function runStatus(status) {
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
function ownsEnvelope(envelope, userLogin) {
    if (!envelope.createdByLogin || !userLogin)
        return false;
    return envelope.createdByLogin.toLowerCase() === userLogin.toLowerCase();
}
function canResume(envelope) {
    return envelope.status !== "complete" && getReportDefinition(envelope.kind) !== undefined;
}
function toStep(stage) {
    return {
        key: stage.key,
        label: stage.label,
        status: stage.status,
        ratio: stage.total ? stage.processed / stage.total : undefined,
        countLabel: stage.total ? `${stage.processed}/${stage.total}` : undefined,
        message: stage.error,
    };
}
export default ReportsPage;
//# sourceMappingURL=Reports.page.js.map