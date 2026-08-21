import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { Drawer } from "@/components/actions/Drawer";
import { Dropdown } from "@/components/inputs/Dropdown";
import { Modal } from "@/components/actions/Modal";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBox } from "@/components/inputs/SearchBox";
import { Table } from "@/components/data/Table";
import { TableColumn } from "@/components/Components.types";
import { Toolbar } from "@/components/layout/Toolbar";
import { AsyncBoundary } from "@/components/states/AsyncBoundary";
import { LoadingState } from "@/components/states/Loading.state";
import { ProgressGroup } from "@/components/feedback/ProgressGroup";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ProgressStatus, ProgressStep } from "@/components/Components.types";
import { ReportEnvelope } from "@/api/Reports.types";
import { getReportDefinition, resumeSavedEnvelope } from "@/core/report/Report.store";
import { navigate } from "@/core/state/App.store";
import { MODULES } from "@/modules/Modules.registry";
import { useAsync } from "@/core/hooks/useAsync";
import { Reports } from "@/api/Reports.api";
import { ReportSummary } from "@/api/Reports.types";
import { getWebUrl } from "@/api/Sp.api";
import { formatBytes, formatDateTime } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";
import { toErrorMessage } from "@/utils/Guard.util";
import { ReportsContent } from "@/pages/reports/Reports.content";
import { filterReports, kindLabel, kindOptions, visibleReports } from "@/pages/reports/Reports.logic";
import { useApp } from "@/core/context/App.context";
import { Tokens } from "@/theme/Tokens";

const ReportsPage: React.FC = () => {
  const reports = useAsync(() => Reports().list());
  const { access } = useApp();
  const userLogin = access.user.loginName;
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState("all");
  const [preview, setPreview] = React.useState<ReportSummary | undefined>(undefined);
  const [previewBody, setPreviewBody] = React.useState<string | undefined>(undefined);
  const [previewEnvelope, setPreviewEnvelope] = React.useState<ReportEnvelope | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = React.useState<ReportSummary | undefined>(undefined);

  const openPreview = (report: ReportSummary): void => {
    setPreview(report);
    setPreviewBody(undefined);
    setPreviewEnvelope(undefined);
    Reports()
      .read(report.serverRelativeUrl)
      .then((envelope) => {
        setPreviewEnvelope(envelope as ReportEnvelope);
        setPreviewBody(JSON.stringify(envelope, null, 2));
      })
      .catch((error: unknown) => setPreviewBody(toErrorMessage(error)));
  };

  const confirmDelete = (): void => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(undefined);
    Reports()
      .remove(target.serverRelativeUrl)
      .then(() => reports.reload())
      .catch(() => reports.reload());
  };

  const columns: TableColumn<ReportSummary>[] = [
    {
      key: "name",
      header: ReportsContent.columns.name,
      minWidth: 240,
      maxWidth: 360,
      sortValue: (report) => report.name,
      render: (report) => <span style={{ fontWeight: 600 }}>{report.name}</span>,
    },
    {
      key: "kind",
      header: ReportsContent.columns.kind,
      minWidth: 150,
      sortValue: (report) => report.kind,
      filterValue: (report) => kindLabel(report.kind),
      render: (report) => <Badge label={kindLabel(report.kind)} tone="info" />,
    },
    {
      key: "status",
      header: ReportsContent.columns.status,
      minWidth: 120,
      sortValue: (report) => report.status,
      filterValue: (report) => report.status,
      render: (report) => <StatusBadge status={runStatus(report.status)} />,
    },
    {
      key: "createdBy",
      header: ReportsContent.columns.createdBy,
      minWidth: 150,
      sortValue: (report) => report.createdBy,
      filterValue: (report) => report.createdBy || ReportsContent.unknownUser,
      render: (report) => <span>{report.createdBy || ReportsContent.unknownUser}</span>,
    },
    {
      key: "modified",
      header: ReportsContent.columns.modified,
      minWidth: 170,
      sortValue: (report) => report.modified,
      render: (report) => <span>{formatDateTime(report.modified)}</span>,
    },
    {
      key: "size",
      header: ReportsContent.columns.size,
      minWidth: 100,
      sortValue: (report) => report.sizeBytes,
      render: (report) => <span>{formatBytes(report.sizeBytes)}</span>,
    },
    {
      key: "actions",
      header: ReportsContent.columns.actions,
      minWidth: 220,
      render: (report) => (
        <div style={{ display: "flex", gap: Tokens.space.xs }}>
          <Button label={ReportsContent.open} variant="subtle" onClick={() => openPreview(report)} />
          <Button
            label={ReportsContent.download}
            variant="subtle"
            href={absoluteFromServerRelative(report.serverRelativeUrl, getWebUrl())}
          />
          <Button label={ReportsContent.delete} variant="subtle" onClick={() => setPendingDelete(report)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={ReportsContent.title}
        description={ReportsContent.description}
        actions={
          <>
            <Button
              label={ReportsContent.openFolder}
              iconName="FolderHorizontal"
              newTab
              href={absoluteFromServerRelative(Reports().folderUrl(), getWebUrl())}
            />
            <Button label={ReportsContent.refresh} iconName="Refresh" onClick={reports.reload} />
          </>
        }
      />

      <Toolbar ariaLabel="Report filters">
        <SearchBox label={ReportsContent.search} value={search} onChange={setSearch} />
        <div style={{ minWidth: 200 }}>
          <Dropdown
            label={ReportsContent.filterKind}
            options={kindOptions(reports.data ?? [])}
            selectedKey={kind}
            onChange={setKind}
          />
        </div>
      </Toolbar>

      <AsyncBoundary
        result={reports}
        empty={{
          title: ReportsContent.empty.title,
          description: ReportsContent.empty.description,
          iconName: "ReportDocument",
        }}
      >
        {(data) => (
          <Table
            ariaLabel={ReportsContent.title}
            columns={columns}
            rows={filterReports(visibleReports(data, userLogin), search, kind)}
            getRowKey={(report) => report.serverRelativeUrl}
            initialSortKey="modified"
            initialSortDescending
          />
        )}
      </AsyncBoundary>

      <Drawer
        open={Boolean(preview)}
        title={preview?.name ?? ""}
        width="large"
        onDismiss={() => setPreview(undefined)}
      >
        {previewEnvelope && (
          <div style={{ display: "grid", gap: Tokens.space.md, marginBottom: Tokens.space.md }}>
            <div style={{ display: "flex", gap: Tokens.space.sm, alignItems: "center", flexWrap: "wrap" }}>
              <StatusBadge status={runStatus(previewEnvelope.status)} />
              <span style={{ color: Tokens.colour.textMuted }}>{previewEnvelope.issues.length} issues</span>
              {previewEnvelope.status !== "complete" && !ownsEnvelope(previewEnvelope, userLogin) && (
                <span style={{ color: Tokens.colour.textMuted }}>
                  {ReportsContent.notYours} {previewEnvelope.createdBy}
                </span>
              )}

              {canResume(previewEnvelope) && ownsEnvelope(previewEnvelope, userLogin) && (
                <Button
                  label={ReportsContent.resume}
                  variant="primary"
                  iconName="Play"
                  onClick={() => {
                    resumeSavedEnvelope(previewEnvelope);
                    const app = MODULES.find((entry) => entry.report?.kind === previewEnvelope.kind);
                    setPreview(undefined);
                    if (app) navigate(app.key);
                  }}
                />
              )}
            </div>

            <ProgressGroup
              label={previewEnvelope.title}
              status={runStatus(previewEnvelope.status)}
              steps={previewEnvelope.stages.map(toStep)}
            />
          </div>
        )}

        {previewBody === undefined ? (
          <LoadingState />
        ) : (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: Tokens.font.sm,
              background: Tokens.colour.surfaceAlt,
              padding: Tokens.space.md,
              borderRadius: Tokens.radius.sm,
            }}
          >
            {previewBody}
          </pre>
        )}
      </Drawer>

      <Modal
        open={Boolean(pendingDelete)}
        title={ReportsContent.deleteTitle}
        description={ReportsContent.deleteBody}
        onDismiss={() => setPendingDelete(undefined)}
        footer={
          <>
            <Button label={ReportsContent.confirm} variant="danger" onClick={confirmDelete} />
            <Button label={ReportsContent.cancel} onClick={() => setPendingDelete(undefined)} />
          </>
        }
      />
    </>
  );
};

function runStatus(status: ReportEnvelope["status"]): ProgressStatus {
  if (status === "complete") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "paused") return "paused";
  if (status === "cancelled") return "cancelled";
  if (status === "interrupted") return "interrupted";
  if (status === "running") return "running";
  return "pending";
}

function ownsEnvelope(envelope: ReportEnvelope, userLogin: string): boolean {
  if (!envelope.createdByLogin || !userLogin) return false;
  return envelope.createdByLogin.toLowerCase() === userLogin.toLowerCase();
}

function canResume(envelope: ReportEnvelope): boolean {
  return envelope.status !== "complete" && getReportDefinition(envelope.kind) !== undefined;
}

function toStep(stage: ReportEnvelope["stages"][number]): ProgressStep {
  return {
    key: stage.key,
    label: stage.label,
    status: stage.status as ProgressStatus,
    ratio: stage.total ? stage.processed / stage.total : undefined,
    countLabel: stage.total ? `${stage.processed}/${stage.total}` : undefined,
    message: stage.error,
  };
}

export default ReportsPage;
