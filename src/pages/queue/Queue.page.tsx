import * as React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/layout/Card";
import { StatTile } from "@/components/layout/StatTile";
import { Toolbar } from "@/components/layout/Toolbar";
import { Button } from "@/components/actions/Button";
import { NumberField } from "@/components/inputs/NumberField";
import { Checkbox } from "@/components/inputs/Checkbox";
import { FieldRow } from "@/components/inputs/FieldRow";
import { ErrorDrawer } from "@/components/feedback/ErrorDrawer";
import { Notice } from "@/components/feedback/Notice";
import { EmptyState } from "@/components/states/Empty.state";
import { Theme } from "@/theme/Theme.api";
import { QueueTask } from "@/core/queue/Queue.types";
import { clearFinished, enqueue, isActive, retryTask, setConcurrency, useQueue } from "@/core/queue/Queue.store";
import { PageInventoryPayload, TASK_PAGE_INVENTORY } from "@/core/queue/Queue.tasks";
import { useThrottleState } from "@/api/Throttle.api";
import { TaskCard } from "@/app/TaskCard";
import { QueueContent } from "@/pages/queue/Queue.content";
import { taskDuration } from "@/pages/queue/Queue.logic";
import { formatDateTime, formatNumber } from "@/utils/Format.util";

const QueuePage: React.FC = () => {
  const { tasks, concurrency } = useQueue();
  const throttle = useThrottleState();
  const [maxPages, setMaxPages] = React.useState(200);
  const [saveReport, setSaveReport] = React.useState(true);
  const [errorTask, setErrorTask] = React.useState<QueueTask | undefined>(undefined);

  const active = tasks.filter((task) => isActive(task.status));
  const finished = tasks.filter((task) => !isActive(task.status));

  return (
    <>
      <PageHeader
        title={QueueContent.title}
        description={QueueContent.description}
        actions={
          <Button
            label={QueueContent.clear}
            iconName="Delete"
            onClick={clearFinished}
            disabled={finished.length === 0}
          />
        }
      />

      <div style={{ display: "grid", gap: Theme.tokens.space.lg, minWidth: 0 }}>
        <div style={{ display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" }}>
          <StatTile
            label={QueueContent.stats.active}
            value={formatNumber(active.length)}
            tone={active.length > 0 ? "info" : "neutral"}
            badge={active.length > 0 ? QueueContent.stats.running : undefined}
          />
          <StatTile label={QueueContent.stats.finished} value={formatNumber(finished.length)} />
          <StatTile label={QueueContent.stats.inFlight} value={formatNumber(throttle.inFlight)} />
          <StatTile label={QueueContent.stats.queuedRequests} value={formatNumber(throttle.queued)} />
          <StatTile
            label={QueueContent.stats.retries}
            value={formatNumber(throttle.retries)}
            tone="warning"
            badge={throttle.status === "throttled" ? QueueContent.stats.throttled : undefined}
          />
        </div>

        {throttle.status === "throttled" && <Notice tone="warning" message={QueueContent.throttledNotice} />}

        <Card title={QueueContent.settingsTitle}>
          <FieldRow>
            <NumberField
              label={QueueContent.concurrency}
              value={concurrency}
              min={1}
              max={4}
              onChange={setConcurrency}
            />
          </FieldRow>
        </Card>

        <Card title={QueueContent.demoTitle} subtitle={QueueContent.demoSubtitle}>
          <FieldRow>
            <NumberField
              label={QueueContent.maxPages}
              value={maxPages}
              min={1}
              max={5000}
              step={50}
              onChange={setMaxPages}
            />
            <Checkbox label={QueueContent.saveReport} checked={saveReport} onChange={setSaveReport} />
            <div>
              <Button
                label={QueueContent.demoLabel}
                variant="primary"
                iconName="Play"
                onClick={() =>
                  enqueue<PageInventoryPayload>({
                    kind: TASK_PAGE_INVENTORY,
                    label: "Site page inventory",
                    payload: { maxPages, saveReport },
                  })
                }
              />
            </div>
          </FieldRow>
        </Card>

        <section style={{ display: "grid", gap: Theme.tokens.space.md, minWidth: 0 }}>
          <Toolbar ariaLabel={QueueContent.activeTitle}>
            <h2 style={{ margin: 0, fontSize: Theme.tokens.font.lg }}>{QueueContent.activeTitle}</h2>
          </Toolbar>

          {active.length === 0 ? (
            <EmptyState
              title={QueueContent.empty.title}
              description={QueueContent.empty.description}
              iconName="TaskManager"
            />
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.md }}>
              {active.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} onViewError={setErrorTask} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {finished.length > 0 && (
          <section style={{ display: "grid", gap: Theme.tokens.space.md, minWidth: 0 }}>
            <Toolbar ariaLabel={QueueContent.historyTitle}>
              <h2 style={{ margin: 0, fontSize: Theme.tokens.font.lg }}>{QueueContent.historyTitle}</h2>
            </Toolbar>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: Theme.tokens.space.sm }}>
              {finished.map((task) => (
                <li key={task.id}>
                  <TaskCard task={task} onViewError={setErrorTask} compact />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ErrorDrawer
        open={Boolean(errorTask)}
        title={errorTask?.label ?? ""}
        message={errorTask?.error ?? ""}
        context={
          errorTask
            ? [
                { label: "Task", value: errorTask.kind },
                { label: "Queued", value: formatDateTime(new Date(errorTask.queuedAt)) },
                { label: "Duration", value: taskDuration(errorTask) },
                { label: "Last step", value: errorTask.progress.message ?? "-" },
              ]
            : undefined
        }
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
    </>
  );
};

export default QueuePage;
