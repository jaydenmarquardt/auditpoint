import { QueueTask } from "@/core/queue/Queue.types";
import { formatDuration } from "@/utils/Format.util";

export function taskDuration(task: QueueTask): string {
  if (!task.startedAt) return "-";
  return formatDuration((task.finishedAt ?? Date.now()) - task.startedAt);
}

export function isFinished(task: QueueTask): boolean {
  return task.status === "succeeded" || task.status === "failed" || task.status === "cancelled";
}
