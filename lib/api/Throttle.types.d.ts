export type ThrottleStatus = "idle" | "running" | "throttled" | "paused";
export interface ThrottleOptions {
    /** Simultaneous requests allowed against SharePoint. */
    concurrency: number;
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
}
export interface ThrottleState {
    status: ThrottleStatus;
    inFlight: number;
    queued: number;
    completed: number;
    failed: number;
    retries: number;
    /** Epoch ms the current throttle backoff clears. */
    resumesAt?: number;
    lastError?: string;
}
export interface ThrottleCallOptions {
    label?: string;
    retries?: number;
    /** Skips the queue, use only for user-blocking single reads. */
    priority?: boolean;
}
//# sourceMappingURL=Throttle.types.d.ts.map