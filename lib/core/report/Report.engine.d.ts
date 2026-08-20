import { ReportEnvelope } from "../../api/Reports.types";
import { ReportDefinition, RunOptions, RunResult } from "./Report.types";
export declare function createEnvelope<TData, TConfig>(definition: ReportDefinition<TData, TConfig>, sites: string[], config: TConfig, createdBy: string, createdByLogin: string): ReportEnvelope<TData, TConfig>;
/** Checkpoints after each stage; a resume skips succeeded stages and restores the cursor. */
export declare function runReport<TData, TConfig>(definition: ReportDefinition<TData, TConfig>, options: RunOptions<TData, TConfig>): Promise<RunResult<TData, TConfig>>;
//# sourceMappingURL=Report.engine.d.ts.map