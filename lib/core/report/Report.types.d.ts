import { LogLevel, ReportEnvelope, ReportIssue, ReportStageState } from "../../api/Reports.types";
export type ConfigFieldType = "text" | "number" | "toggle" | "choice";
export interface ConfigField<TConfig> {
    key: keyof TConfig & string;
    label: string;
    type: ConfigFieldType;
    description?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: {
        key: string;
        text: string;
    }[];
}
export interface StageContext<TData, TConfig> {
    siteUrl: string;
    config: TConfig;
    data: Partial<TData>;
    cursor: unknown;
    progress(processed: number, total?: number): void;
    setCursor(cursor: unknown): void;
    issue(issue: Omit<ReportIssue, "iso" | "stage">): void;
    log(message: string, level?: LogLevel): void;
    isCancelled(): boolean;
    /** Blocks while the run is paused; call inside long loops. */
    waitIfPaused(): Promise<void>;
}
export interface ReportStageDefinition<TData, TConfig> {
    key: string;
    label: string;
    run(context: StageContext<TData, TConfig>): Promise<void>;
}
export interface ReportDefinition<TData, TConfig = Record<string, unknown>> {
    kind: string;
    title: string;
    description: string;
    iconName: string;
    /** Report contract version, bumped with the module. */
    version: string;
    schemaVersion: number;
    defaultConfig: TConfig;
    configFields: ConfigField<TConfig>[];
    stages: ReportStageDefinition<TData, TConfig>[];
}
export interface RunOptions<TData, TConfig> {
    sites: string[];
    config: TConfig;
    resumeFrom?: ReportEnvelope<TData, TConfig>;
    createdBy: string;
    createdByLogin: string;
    onUpdate(envelope: ReportEnvelope<TData, TConfig>): void;
    persist(envelope: ReportEnvelope<TData, TConfig>): Promise<void>;
    isCancelled(): boolean;
    isPaused(): boolean;
    captureLogs: boolean;
}
export interface RunResult<TData, TConfig> {
    envelope: ReportEnvelope<TData, TConfig>;
    stages: ReportStageState[];
}
//# sourceMappingURL=Report.types.d.ts.map