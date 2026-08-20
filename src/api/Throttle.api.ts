import { createStore, useStore } from "@/core/state/Store";
import { toErrorMessage } from "@/utils/Guard.util";
import { ThrottleCallOptions, ThrottleOptions, ThrottleState } from "@/api/Throttle.types";

const DEFAULTS: ThrottleOptions = {
  concurrency: 4,
  maxRetries: 5,
  baseDelayMs: 1000,
  maxDelayMs: 60000,
};

interface PendingCall<T> {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  retries: number;
  attempt: number;
  priority: boolean;
}

let options: ThrottleOptions = { ...DEFAULTS };
let paused = false;
const pending: PendingCall<unknown>[] = [];

export const throttleStore = createStore<ThrottleState>({
  status: "idle",
  inFlight: 0,
  queued: 0,
  completed: 0,
  failed: 0,
  retries: 0,
});

export function configureThrottle(next: Partial<ThrottleOptions>): void {
  options = { ...options, ...next };
  pump();
}

export function pauseThrottle(): void {
  paused = true;
  patch({ status: "paused" });
}

export function resumeThrottle(): void {
  paused = false;
  patch({ status: pending.length > 0 ? "running" : "idle", resumesAt: undefined });
  pump();
}

export function isThrottlePaused(): boolean {
  return paused;
}

export function useThrottleState(): ThrottleState {
  return useStore(throttleStore);
}

/** Every SharePoint call goes through here so 429/503 backoff is handled in one place. */
export function throttled<T>(run: () => Promise<T>, callOptions: ThrottleCallOptions = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const call: PendingCall<T> = {
      run,
      resolve,
      reject,
      retries: callOptions.retries ?? options.maxRetries,
      attempt: 0,
      priority: Boolean(callOptions.priority),
    };

    if (call.priority) pending.unshift(call as PendingCall<unknown>);
    else pending.push(call as PendingCall<unknown>);

    patch({ queued: pending.length, status: paused ? "paused" : "running" });
    pump();
  });
}

export async function throttledAll<T>(
  runners: (() => Promise<T>)[],
  callOptions: ThrottleCallOptions = {}
): Promise<T[]> {
  return Promise.all(runners.map((runner) => throttled(runner, callOptions)));
}

function patch(changes: Partial<ThrottleState>): void {
  throttleStore.setState((state) => ({ ...state, ...changes }));
}

function pump(): void {
  if (paused) return;

  while (throttleStore.getState().inFlight < options.concurrency && pending.length > 0) {
    const call = pending.shift();
    if (!call) return;
    patch({ queued: pending.length, inFlight: throttleStore.getState().inFlight + 1, status: "running" });
    void execute(call);
  }

  if (pending.length === 0 && throttleStore.getState().inFlight === 0) patch({ status: "idle" });
}

async function execute(call: PendingCall<unknown>): Promise<void> {
  try {
    const result = await call.run();
    patch({ completed: throttleStore.getState().completed + 1 });
    call.resolve(result);
  } catch (error) {
    const wait = retryDelay(error, call.attempt);

    if (wait !== undefined && call.attempt < call.retries) {
      call.attempt = call.attempt + 1;
      patch({
        retries: throttleStore.getState().retries + 1,
        status: "throttled",
        resumesAt: Date.now() + wait,
      });
      setTimeout(() => {
        pending.unshift(call);
        patch({ queued: pending.length, resumesAt: undefined });
        pump();
      }, wait);
    } else {
      patch({ failed: throttleStore.getState().failed + 1, lastError: toErrorMessage(error) });
      call.reject(error);
    }
  } finally {
    patch({ inFlight: Math.max(0, throttleStore.getState().inFlight - 1) });
    pump();
  }
}

function retryDelay(error: unknown, attempt: number): number | undefined {
  const status = readStatus(error);
  if (status !== 429 && status !== 503 && status !== 504) return undefined;

  const retryAfter = readRetryAfter(error);
  if (retryAfter !== undefined) return Math.min(retryAfter * 1000, options.maxDelayMs);

  const backoff = options.baseDelayMs * Math.pow(2, attempt);
  return Math.min(backoff + Math.random() * 250, options.maxDelayMs);
}

function readStatus(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number; message?: string };
  if (typeof candidate?.status === "number") return candidate.status;
  if (typeof candidate?.httpStatus === "number") return candidate.httpStatus;
  const match = /\b(429|503|504)\b/.exec(candidate?.message ?? "");
  return match ? Number(match[1]) : undefined;
}

function readRetryAfter(error: unknown): number | undefined {
  const headers = (error as { headers?: Headers })?.headers;
  const raw = headers && typeof headers.get === "function" ? headers.get("Retry-After") : undefined;
  const parsed = raw ? Number(raw) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
}
