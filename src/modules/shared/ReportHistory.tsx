import * as React from "react";
import { Card } from "@/components/layout/Card";
import { Modal } from "@/components/actions/Modal";
import { Notice } from "@/components/feedback/Notice";
import { Table } from "@/components/data/Table";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ProgressStatus, TableColumn } from "@/components/Components.types";
import { AsyncBoundary } from "@/components/states/AsyncBoundary";
import { useAsync } from "@/core/hooks/useAsync";
import { useApp } from "@/core/context/App.context";
import { Reports, reportFolderUrl } from "@/api/Reports.api";
import { ReportIndexEntry } from "@/api/Reports.types";
import { Theme } from "@/theme/Theme.api";
import { durationBetween, formatDateTime } from "@/utils/Format.util";
import { toErrorMessage } from "@/utils/Guard.util";
import { ReportHistoryProps } from "@/modules/shared/Shared.types";

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  kind,
  title,
  newLabel,
  onNew,
  onOpen,
  onResume,
  busy,
  onImport,
  error,
  onDismissError,
}) => {
  const fileInput = React.useRef<HTMLInputElement>(null);
  const { access } = useApp();
  const [pendingDelete, setPendingDelete] = React.useState<ReportIndexEntry | undefined>(undefined);
  // A large run takes seconds to read, so the row that was clicked says so.
  const [opening, setOpening] = React.useState<string | undefined>(undefined);
  const [deleteError, setDeleteError] = React.useState<string | undefined>(undefined);
  const entries = useAsync(async () => (await Reports().index()).filter((entry) => entry.kind === kind), {
    deps: [kind],
  });

  const urlOf = (entry: ReportIndexEntry): string => `${reportFolderUrl()}/${entry.fileName}`;

  const run = (entry: ReportIndexEntry, action: (url: string) => void | Promise<void>): void => {
    setOpening(entry.id);

    Promise.resolve(action(urlOf(entry)))
      .then(() => setOpening(undefined))
      .catch(() => setOpening(undefined));
  };

  const remove = (entry: ReportIndexEntry): void => {
    setPendingDelete(undefined);
    setDeleteError(undefined);

    Reports()
      .remove(urlOf(entry))
      .then(entries.reload)
      .catch((failure: unknown) => {
        setDeleteError(toErrorMessage(failure));
        entries.reload();
      });
  };

  const owns = (entry: ReportIndexEntry): boolean =>
    Boolean(entry.createdByLogin) &&
    entry.createdByLogin.toLowerCase() === access.user.loginName.toLowerCase();

  const columns: TableColumn<ReportIndexEntry>[] = [
    {
      key: "updated",
      header: "Run",
      minWidth: 190,
      sortValue: (entry) => entry.updatedIso,
      render: (entry) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>{entry.title || formatDateTime(entry.updatedIso)}</div>
          <div style={{ fontSize: Theme.tokens.font.sm }}>{formatDateTime(entry.updatedIso)}</div>
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            v{entry.version} · {entry.sites.length} site(s)
          </div>
        </div>
      ),
    },
    {
      key: "site",
      header: "Site",
      minWidth: 200,
      sortValue: (entry) => entry.sites[0] ?? "",
      filterValue: (entry) => siteName(entry.sites[0] ?? ""),
      render: (entry) => (
        <span title={entry.sites.join(", ")}>{entry.sites.map(siteName).join(", ") || "-"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      minWidth: 130,
      sortValue: (entry) => entry.status,
      filterValue: (entry) => entry.status,
      render: (entry) => <StatusBadge status={statusOf(entry.status)} />,
    },
    {
      key: "duration",
      header: "Duration",
      minWidth: 110,
      sortValue: (entry) => new Date(entry.updatedIso).getTime() - new Date(entry.createdIso).getTime(),
      render: (entry) => <span>{durationBetween(entry.createdIso, entry.updatedIso)}</span>,
    },
    {
      key: "createdBy",
      header: "Run by",
      minWidth: 160,
      sortValue: (entry) => entry.createdBy,
      filterValue: (entry) => entry.createdBy || "Unknown",
      render: (entry) => <span>{entry.createdBy || "Unknown"}</span>,
    },
    {
      key: "issues",
      header: "Issues",
      minWidth: 90,
      sortValue: (entry) => entry.issues,
      render: (entry) => (
        <Badge label={String(entry.issues)} tone={entry.issues > 0 ? "warning" : "neutral"} showIcon={false} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 300,
      render: (entry) => (
        <div style={{ display: "flex", gap: 4 }}>
          <Button
            label={opening === entry.id ? "Opening" : "Open"}
            variant="subtle"
            iconName="OpenFile"
            busy={opening === entry.id}
            disabled={busy || Boolean(opening)}
            onClick={() => run(entry, onOpen)}
          />
          {entry.status !== "complete" && owns(entry) && (
            <Button
              label="Resume"
              variant="subtle"
              iconName="Play"
              busy={opening === entry.id}
              disabled={busy || Boolean(opening)}
              onClick={() => run(entry, onResume)}
            />
          )}
          <Button
            label="Delete"
            variant="subtle"
            iconName="Delete"
            disabled={busy}
            onClick={() => setPendingDelete(entry)}
          />
        </div>
      ),
    },
  ];

  return (
    <Card
      title={title}
      actions={
        <div style={{ display: "flex", gap: Theme.tokens.space.sm }}>
          <Button label="Refresh" iconName="Refresh" onClick={entries.reload} />
          {onImport && (
            <Button label="Import JSON" iconName="Upload" onClick={() => fileInput.current?.click()} />
          )}
          <Button label={newLabel} variant="primary" iconName="Add" onClick={onNew} disabled={busy} />
        </div>
      }
    >
      {onImport && (
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Clearing the value lets the same file be picked twice in a row.
            event.target.value = "";
            if (file) onImport(file);
          }}
        />
      )}

      {error && <Notice tone="error" message={error} onDismiss={onDismissError} />}
      {deleteError && <Notice tone="error" message={deleteError} onDismiss={() => setDeleteError(undefined)} />}

      <AsyncBoundary
        result={entries}
        empty={{
          title: "No previous runs",
          description: "Start a new audit to create the first report.",
          iconName: "ReportDocument",
          actionLabel: newLabel,
          onAction: onNew,
        }}
      >
        {(rows) => (
          <Table
            ariaLabel={title}
            rows={rows}
            columns={columns}
            getRowKey={(entry) => entry.id}
            initialSortKey="updated"
            initialSortDescending
          />
        )}
      </AsyncBoundary>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete this run?"
        description="The report file is sent to the site recycle bin. The pages it audited are untouched."
        onDismiss={() => setPendingDelete(undefined)}
        footer={
          <>
            <Button
              label="Delete run"
              variant="danger"
              onClick={() => (pendingDelete ? remove(pendingDelete) : undefined)}
            />
            <Button label="Keep" onClick={() => setPendingDelete(undefined)} />
          </>
        }
      >
        <p style={{ margin: 0 }}>{pendingDelete ? formatDateTime(pendingDelete.updatedIso) : ""}</p>
      </Modal>
    </Card>
  );
};

/** The last path segment is what people call the site; the rest is noise in a table. */
function siteName(url: string): string {
  if (!url) return "";
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1] || url;
}

function statusOf(status: ReportIndexEntry["status"]): ProgressStatus {
  if (status === "complete") return "succeeded";
  if (status === "failed") return "failed";
  if (status === "paused") return "paused";
  if (status === "cancelled") return "cancelled";
  if (status === "interrupted") return "interrupted";
  if (status === "running") return "running";
  return "pending";
}
