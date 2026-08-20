import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { Button } from "@/components/actions/Button";
import { ProgressBar } from "@/components/feedback/ProgressBar";
import { StatusBadge, statusTone } from "@/components/feedback/StatusBadge";
import { ProgressStatus } from "@/components/Components.types";
import { QueueTask } from "@/core/queue/Queue.types";
import { cancelTask, isActive, isTaskLive, pauseTask, removeTask, resumeTask, retryTask } from "@/core/queue/Queue.store";
import { formatDateTime, formatDuration } from "@/utils/Format.util";
import { QueueBarContent } from "@/app/QueueBar.content";

export interface TaskCardProps {
  task: QueueTask;
  onViewError: (task: QueueTask) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onViewError }) => {
  const [open, setOpen] = React.useState(false);
  const status = task.status as ProgressStatus;
  const tone = Theme.tone(statusTone(status));
  const children = task.progress.children ?? [];
  const elapsed = task.startedAt ? formatDuration((task.finishedAt ?? Date.now()) - task.startedAt) : "-";
  // A task left behind by a closed page has no runner to resume, so it is started again.
  const live = isTaskLive(task.id);

  return (
    <section
      style={{
        border: `1px solid ${Theme.palette().border}`,
        borderLeft: `3px solid ${tone.solid}`,
        borderRadius: Theme.tokens.radius.md,
        background: Theme.palette().surface,
        padding: Theme.tokens.space.md,
        display: "grid",
        gap: Theme.tokens.space.sm,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, flexWrap: "wrap" }}>
        <StatusBadge status={status} />

        <div style={{ minWidth: 0, flex: "1 1 220px" }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{task.label}</div>
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            {task.kind} · queued {formatDateTime(new Date(task.queuedAt))} · {elapsed}
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {task.status === "running" && (
            <Button label={QueueBarContent.pause} variant="subtle" iconName="Pause" onClick={() => pauseTask(task.id)} />
          )}
          {task.status === "paused" && live && (
            <Button label={QueueBarContent.resume} variant="subtle" iconName="Play" onClick={() => resumeTask(task.id)} />
          )}
          {task.status === "paused" && !live && (
            <Button label={QueueBarContent.retry} variant="subtle" iconName="Refresh" onClick={() => retryTask(task.id)} />
          )}
          {isActive(task.status) && (
            <Button label={QueueBarContent.cancel} variant="subtle" iconName="Cancel" onClick={() => cancelTask(task.id)} />
          )}
          {task.status === "failed" && (
            <>
              <Button label={QueueBarContent.viewError} variant="subtle" iconName="Error" onClick={() => onViewError(task)} />
              <Button label={QueueBarContent.retry} variant="subtle" iconName="Refresh" onClick={() => retryTask(task.id)} />
            </>
          )}
          {!isActive(task.status) && (
            <Button label={QueueBarContent.remove} variant="subtle" iconName="Delete" onClick={() => removeTask(task.id)} />
          )}
        </div>
      </div>

      <ProgressBar
        ratio={task.progress.ratio}
        status={status}
        countLabel={task.progress.message}
        description={task.error}
      />

      {children.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            style={{
              justifySelf: "start",
              display: "flex",
              alignItems: "center",
              gap: 4,
              minHeight: 32,
              padding: `0 ${Theme.tokens.space.sm}`,
              border: `1px solid ${Theme.palette().border}`,
              borderRadius: Theme.tokens.radius.sm,
              background: Theme.palette().surface,
              font: "inherit",
              fontSize: Theme.tokens.font.sm,
              cursor: "pointer",
            }}
          >
            <i className={`ms-Icon ms-Icon--${open ? "ChevronUp" : "ChevronDown"}`} aria-hidden="true" />
            {open ? QueueBarContent.hideSteps : `${QueueBarContent.showSteps} (${children.length})`}
          </button>

          {open && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm }}>
              {children.map((child) => (
                <li key={child.key}>
                  <ProgressBar
                    label={child.label}
                    ratio={child.ratio}
                    status={child.status as ProgressStatus}
                    countLabel={child.message}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};
