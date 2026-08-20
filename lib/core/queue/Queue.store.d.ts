import { QueueTask, TaskRunner, TaskStatus } from "./Queue.types";
export interface QueueState {
    tasks: QueueTask[];
    concurrency: number;
}
export declare const queueStore: import("../state/Store").Store<QueueState>;
export declare function registerTaskRunner<TPayload, TResult>(kind: string, runner: TaskRunner<TPayload, TResult>): void;
export declare function setConcurrency(concurrency: number): void;
export declare function enqueue<TPayload>(input: {
    kind: string;
    label: string;
    payload: TPayload;
}): string;
export declare function isTaskLive(id: string): boolean;
export declare function pauseTask(id: string): void;
/** Only a live task can be resumed in place; a restored one has to be started again. */
export declare function resumeTask(id: string): boolean;
export declare function cancelTask(id: string): void;
export declare function retryTask(id: string): string | undefined;
export declare function clearFinished(): void;
export declare function removeTask(id: string): void;
export declare function isActive(status: TaskStatus): boolean;
export declare function useQueue(): QueueState;
export declare function useActiveTaskCount(): number;
export declare function getTask(id: string): QueueTask | undefined;
//# sourceMappingURL=Queue.store.d.ts.map