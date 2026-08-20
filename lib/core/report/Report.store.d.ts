import { TaskStatus } from "../queue/Queue.types";
import { ReportEnvelope } from "../../api/Reports.types";
import { ReportDefinition } from "./Report.types";
export interface ReportRunState {
    kind: string;
    taskId?: string;
    envelope?: ReportEnvelope;
    savedUrl?: string;
}
export interface StartReportInput<TData, TConfig> {
    sites?: string[];
    config?: TConfig;
    resumeFrom?: ReportEnvelope<TData, TConfig>;
}
export declare const reportStore: import("../state/Store").Store<Record<string, ReportRunState>>;
/**
 * Config a host wants a report to start with, keyed by report kind. Merged over the
 * report's own defaults, so a solution can raise a limit or switch a stage on
 * without touching the module.
 */
export declare function setReportDefaults(defaults: Record<string, Record<string, unknown>> | undefined): void;
export declare function reportConfig<TConfig>(definition: ReportDefinition<unknown, TConfig>): TConfig;
export declare function getReportDefinition(kind: string): ReportDefinition<unknown, unknown> | undefined;
export declare function resumeSavedEnvelope(envelope: ReportEnvelope): string | undefined;
export declare function taskKind(kind: string): string;
export declare function registerReport<TData, TConfig>(definition: ReportDefinition<TData, TConfig>): void;
export declare function startReport<TData, TConfig>(definition: ReportDefinition<TData, TConfig>, input?: StartReportInput<TData, TConfig>): string;
export declare function openEnvelope(envelope: ReportEnvelope): void;
export declare function clearRun(kind: string): void;
export declare function useReportRun(kind: string): ReportRunState & {
    taskStatus?: TaskStatus;
};
//# sourceMappingURL=Report.store.d.ts.map