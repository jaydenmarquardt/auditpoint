import { TaskStatus } from "../queue/Queue.types";
import { ReportEnvelope } from "../../api/Reports.types";
import { ReportDefinition } from "./Report.types";
export interface ReportController<TData, TConfig = Record<string, unknown>> {
    envelope?: ReportEnvelope<TData, TConfig>;
    config: TConfig;
    setConfig(config: TConfig): void;
    status: TaskStatus | "idle";
    running: boolean;
    paused: boolean;
    savedUrl?: string;
    /** Last failure from opening or resuming a saved run, for the page to surface. */
    error?: string;
    clearError(): void;
    start(sites?: string[]): void;
    resume(): void;
    pause(): void;
    cancel(): void;
    open(serverRelativeUrl: string): Promise<void>;
    /** Loads a previously exported run from a file, without touching the library. */
    importJson(file: File): Promise<void>;
    /** Keeps the current settings as the starting point for future runs. */
    saveConfigAsDefault(): void;
    resetConfig(): void;
    resumeSaved(serverRelativeUrl: string): Promise<void>;
    clear(): void;
}
export declare function useReport<TData, TConfig>(definition: ReportDefinition<TData, TConfig>): ReportController<TData, TConfig>;
//# sourceMappingURL=useReport.d.ts.map