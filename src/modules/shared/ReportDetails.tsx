import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Table } from "@/components/data/Table";
import { Tabs } from "@/components/data/Tabs";
import { ProgressStatus, TableColumn } from "@/components/Components.types";
import { EmptyState } from "@/components/states/Empty.state";
import { Theme } from "@/theme/Theme.api";
import { ReportEnvelope, ReportIssue, ReportLogEntry } from "@/api/Reports.types";
import { ConfigField } from "@/core/report/Report.types";
import { durationBetween, formatDateTime } from "@/utils/Format.util";
import { downloadJson } from "@/utils/Export.util";
import { ReportDetailsProps } from "@/modules/shared/Shared.types";

export const ReportDetails: React.FC<ReportDetailsProps> = ({
  open,
  onDismiss,
  envelope,
  definition,
  logsEnabled,
}) => {
  const [tab, setTab] = React.useState("settings");
  if (!envelope) return null;

  const run = envelope as ReportEnvelope;
  const config = (run.config ?? {}) as Record<string, unknown>;

  const settings = definition.configFields.map((field: ConfigField<unknown>) => ({
    key: field.key,
    label: field.label,
    value: format(config[field.key]),
  }));

  return (
    <PreviewDialog
      open={open}
      onDismiss={onDismiss}
      title={`${run.title}: run details`}
      description="Settings used for this run, plus the log and issues captured while it ran."
      width="large"
      facts={[
        { label: "Status", value: <StatusBadge status={runStatus(run.status)} /> },
        { label: "Started", value: formatDateTime(run.createdIso) },
        { label: "Updated", value: formatDateTime(run.updatedIso) },
        { label: "Run by", value: run.createdBy || "Unknown" },
        { label: "Report version", value: `v${run.version}` },
        {
          label: "Duration",
          value: durationBetween(run.createdIso, run.status === "running" ? undefined : run.updatedIso),
        },
        { label: "Sites", value: run.sites.join(", ") || "-" },
      ]}
      actions={
        <>
          <Button
            label="Export report JSON"
            iconName="Download"
            onClick={() => downloadJson(`${run.kind}-${run.id}`, run)}
          />
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
    >
      <Tabs
        ariaLabel="Run details"
        selectedKey={tab}
        onChange={setTab}
        items={[
          {
            key: "settings",
            label: "Settings used",
            content: (
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                  gap: Theme.tokens.space.md,
                  margin: 0,
                }}
              >
                {settings.map((setting) => (
                  <div key={setting.key}>
                    <dt style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
                      {setting.label}
                    </dt>
                    <dd style={{ margin: "2px 0 0", fontWeight: 600 }}>{setting.value}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
          {
            key: "stages",
            label: "Stages",
            count: run.stages.length,
            content: (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm }}>
                {run.stages.map((stage) => (
                  <li
                    key={stage.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: Theme.tokens.space.sm,
                      padding: Theme.tokens.space.sm,
                      border: `1px solid ${Theme.palette().border}`,
                      borderRadius: Theme.tokens.radius.sm,
                    }}
                  >
                    <span>{stage.label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm }}>
                      <span style={{ color: Theme.palette().textMuted, fontSize: Theme.tokens.font.sm }}>
                        {stage.total
                          ? `${stage.processed.toLocaleString()}/${stage.total.toLocaleString()}`
                          : stage.processed.toLocaleString()}
                        {stage.startedIso ? ` · ${durationBetween(stage.startedIso, stage.finishedIso)}` : ""}
                      </span>
                      <StatusBadge status={stage.status as ProgressStatus} />
                    </span>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            key: "issues",
            label: "Issues",
            count: run.issues.length,
            content:
              run.issues.length === 0 ? (
                <EmptyState
                  title="No issues"
                  description="Targets that returned 401, 403, 429 or an error would be listed here."
                  iconName="ShieldAlert"
                />
              ) : (
                <Table
                  ariaLabel="Issues"
                  rows={run.issues}
                  getRowKey={(issue) => `${issue.iso}-${issue.target}`}
                  columns={issueColumns}
                  searchValue={(issue) => `${issue.stage} ${issue.target} ${issue.message}`}
                  searchLabel="Search issues"
                  initialSortKey="iso"
                  initialSortDescending
                  maxHeight={360}
                />
              ),
          },
          {
            key: "log",
            label: "Log",
            count: run.logs?.length ?? 0,
            content: !logsEnabled ? (
              <EmptyState
                title="Logging is off"
                description="Turn on report logging in Settings to capture a run log."
                iconName="DiagnosticDataBarTooltip"
              />
            ) : (run.logs ?? []).length === 0 ? (
              <EmptyState title="No log entries" description="Entries appear as the report runs." />
            ) : (
              <>
                <Table
                  ariaLabel="Run log"
                  rows={run.logs ?? []}
                  getRowKey={(entry) => `${entry.iso}-${entry.message}`}
                  columns={logColumns}
                  searchValue={(entry) => `${entry.stage} ${entry.level} ${entry.message}`}
                  searchLabel="Search log"
                  initialSortKey="iso"
                  initialSortDescending
                  maxHeight={360}
                />
                <div style={{ marginTop: Theme.tokens.space.sm }}>
                  <Button
                    label="Export log"
                    iconName="Download"
                    onClick={() => downloadJson(`report-log-${run.id}`, run.logs ?? [])}
                  />
                </div>
              </>
            ),
          },
        ]}
      />
    </PreviewDialog>
  );
};

const issueColumns: TableColumn<ReportIssue>[] = [
  {
    key: "iso",
    header: "When",
    minWidth: 170,
    sortValue: (issue) => issue.iso,
    render: (issue) => <span>{formatDateTime(issue.iso)}</span>,
  },
  {
    key: "stage",
    header: "Stage",
    minWidth: 130,
    sortValue: (issue) => issue.stage,
    filterValue: (issue) => issue.stage,
    render: (issue) => <span>{issue.stage}</span>,
  },
  {
    key: "target",
    header: "Target",
    minWidth: 200,
    sortValue: (issue) => issue.target,
    render: (issue) => <span>{issue.target}</span>,
  },
  {
    key: "code",
    header: "Code",
    minWidth: 100,
    sortValue: (issue) => String(issue.code),
    filterValue: (issue) => String(issue.code),
    render: (issue) => (
      <Badge label={String(issue.code)} tone={issue.code === 401 || issue.code === 403 ? "danger" : "warning"} />
    ),
  },
  {
    key: "message",
    header: "Detail",
    minWidth: 260,
    maxWidth: 420,
    sortValue: (issue) => issue.message,
    render: (issue) => <span>{issue.message}</span>,
  },
];

const logColumns: TableColumn<ReportLogEntry>[] = [
  {
    key: "iso",
    header: "Time",
    minWidth: 170,
    sortValue: (entry) => entry.iso,
    render: (entry) => <span>{formatDateTime(entry.iso)}</span>,
  },
  {
    key: "level",
    header: "Level",
    minWidth: 110,
    sortValue: (entry) => entry.level,
    filterValue: (entry) => entry.level,
    render: (entry) => (
      <Badge
        label={entry.level}
        tone={entry.level === "error" ? "danger" : entry.level === "warn" ? "warning" : "info"}
      />
    ),
  },
  {
    key: "stage",
    header: "Stage",
    minWidth: 140,
    sortValue: (entry) => entry.stage,
    filterValue: (entry) => entry.stage,
    render: (entry) => <span>{entry.stage}</span>,
  },
  {
    key: "message",
    header: "Message",
    minWidth: 320,
    maxWidth: 520,
    sortValue: (entry) => entry.message,
    render: (entry) => <span>{entry.message}</span>,
  },
];

function runStatus(status: ReportEnvelope["status"]): ProgressStatus {
  if (status === "complete") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "paused") return "paused";
  if (status === "cancelled") return "cancelled";
  if (status === "running") return "running";
  return "pending";
}

function format(value: unknown): string {
  if (typeof value === "boolean") return value ? "On" : "Off";
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}
