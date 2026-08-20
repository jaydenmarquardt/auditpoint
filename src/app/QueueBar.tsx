import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { IconButton } from "@/components/actions/IconButton";
import { ProgressBar } from "@/components/feedback/ProgressBar";
import { TaskCard } from "@/app/TaskCard";
import { ErrorDrawer } from "@/components/feedback/ErrorDrawer";
import { ProgressStatus } from "@/components/Components.types";
import { QueueTask } from "@/core/queue/Queue.types";
import { clearFinished, isActive, retryTask, useQueue } from "@/core/queue/Queue.store";
import { navigate, toggleQueueBar, useAppState } from "@/core/state/App.store";
import { useThrottleState } from "@/api/Throttle.api";
import { QueueBarContent } from "@/app/QueueBar.content";

export const QueueBar: React.FC = () => {
  const { tasks } = useQueue();
  const [errorTask, setErrorTask] = React.useState<QueueTask | undefined>(undefined);
  const open = useAppState((state) => state.queueBarOpen);
  const throttle = useThrottleState();

  const active = tasks.filter((task) => isActive(task.status));
  const current = active[0];

  return (
    <>
      {open && (
        <div
          role="presentation"
          onClick={toggleQueueBar}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(16, 24, 40, 0.35)",
            zIndex: Theme.tokens.zIndex.topbar,
          }}
        />
      )}

    <section
      aria-label={QueueBarContent.label}
      style={{
        position: "absolute",
        insetInline: 0,
        bottom: 0,
        zIndex: Theme.tokens.zIndex.topbar + 1,
        background: Theme.palette().surface,
        borderTop: `2px solid ${open ? Theme.palette().accent : Theme.palette().border}`,
        boxShadow: open ? "0 -8px 24px rgba(16,24,40,0.18)" : Theme.tokens.shadow.md,
      }}
    >
      {open && (
        <div
          style={{
            maxHeight: "46vh",
            overflowY: "auto",
            padding: Theme.tokens.space.md,
            background: Theme.palette().surfaceAlt,
            borderBottom: `1px solid ${Theme.palette().border}`,
            animation: "auditpoint-slide-up 160ms ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: Theme.tokens.space.sm,
            }}
          >
            <strong>{QueueBarContent.label}</strong>
            <Button label={QueueBarContent.close} iconName="ChevronDown" variant="subtle" onClick={toggleQueueBar} />
          </div>

          {tasks.length === 0 ? (
            <p style={{ margin: 0, color: Theme.palette().textMuted }}>{QueueBarContent.idle}</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.md }}>
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} onViewError={setErrorTask} compact />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: Theme.tokens.space.sm,
          padding: `0 ${Theme.tokens.space.md}`,
          height: 48,
        }}
      >
        <IconButton
          iconName={open ? "ChevronDown" : "ChevronUp"}
          ariaLabel={open ? QueueBarContent.close : QueueBarContent.open}
          onClick={toggleQueueBar}
          toggled={open}
        />

        <strong style={{ fontSize: Theme.tokens.font.sm }}>{QueueBarContent.label}</strong>
        <Badge label={`${active.length} ${QueueBarContent.active}`} tone={active.length > 0 ? "info" : "neutral"} />

        {throttle.status === "throttled" && <Badge label={QueueBarContent.throttled} tone="warning" />}

        <div style={{ flex: "1 1 auto", minWidth: 0, maxWidth: 420, marginRight: "auto" }}>
          {current && (
            <ProgressBar
              compact
              ratio={current.progress.ratio}
              status={current.status as ProgressStatus}
              label={current.label}
              countLabel={current.progress.message}
            />
          )}
        </div>

        <div style={{ display: "flex", gap: Theme.tokens.space.xs, marginLeft: "auto" }}>
          <Button label={QueueBarContent.clear} iconName="Delete" variant="subtle" onClick={clearFinished} />
          <Button
            label={QueueBarContent.viewAll}
            iconName="OpenInNewWindow"
            variant="subtle"
            onClick={() => navigate("queue")}
          />
        </div>
      </div>

      <ErrorDrawer
        open={Boolean(errorTask)}
        title={errorTask?.label ?? ""}
        message={errorTask?.error ?? ""}
        context={errorTask ? [{ label: "Task", value: errorTask.kind }] : undefined}
        onDismiss={() => setErrorTask(undefined)}
        onRetry={
          errorTask
            ? () => {
                retryTask(errorTask.id);
                setErrorTask(undefined);
              }
            : undefined
        }
      />
    </section>
    </>
  );
};
