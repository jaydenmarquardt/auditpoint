export type TaskStatus =
  | "queued"
  | "waiting"
  | "running"
  | "throttled"
  | "paused"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface SubProgress {
  key: string;
  label: string;
  status: TaskStatus;
  ratio?: number;
  message?: string;
}

export interface TaskProgress {
  ratio?: number;
  message?: string;
  /** Child steps for tasks that fan out, report stages, per-site scans. */
  children?: SubProgress[];
}

export interface QueueTask<TPayload = unknown, TResult = unknown> {
  id: string;
  kind: string;
  label: string;
  payload: TPayload;
  status: TaskStatus;
  progress: TaskProgress;
  queuedAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
  result?: TResult;
  /** Set when the task can be picked up again from a saved checkpoint. */
  resumable?: boolean;
}

export interface TaskControls {
  report(progress: TaskProgress): void;
  setStatus(status: TaskStatus): void;
  isCancelled(): boolean;
  isPaused(): boolean;
}

export type TaskRunner<TPayload = unknown, TResult = unknown> = (
  payload: TPayload,
  controls: TaskControls
) => Promise<TResult>;
