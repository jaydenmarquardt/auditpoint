import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { BadgeTone, ProgressStatus, StatusBadgeProps } from "@/components/Components.types";

const MAP: Record<ProgressStatus, { tone: BadgeTone; icon: string; label: string }> = {
  pending: { tone: "neutral", icon: "CircleRing", label: "Pending" },
  waiting: { tone: "neutral", icon: "Clock", label: "Waiting" },
  running: { tone: "info", icon: "Sync", label: "Running" },
  throttled: { tone: "warning", icon: "Hourglass", label: "Throttled" },
  paused: { tone: "warning", icon: "Pause", label: "Paused" },
  succeeded: { tone: "success", icon: "CompletedSolid", label: "Done" },
  failed: { tone: "danger", icon: "ErrorBadge", label: "Failed" },
  cancelled: { tone: "neutral", icon: "Cancel", label: "Cancelled" },
  skipped: { tone: "neutral", icon: "Blocked", label: "Skipped" },
  queued: { tone: "neutral", icon: "Clock", label: "Queued" },
};

/** Queue and stage statuses both land here, so an unknown one must not throw. */
function entryFor(status: ProgressStatus): { tone: BadgeTone; icon: string; label: string } {
  return MAP[status] ?? MAP.pending;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const entry = entryFor(status);
  return <Badge label={label ?? entry.label} tone={entry.tone} iconName={entry.icon} />;
};

export function statusTone(status: ProgressStatus): BadgeTone {
  return entryFor(status).tone;
}

export function statusText(status: ProgressStatus): string {
  return entryFor(status).label;
}
