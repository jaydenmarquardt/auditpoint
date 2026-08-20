import { ReportSummary } from "../../api/Reports.types";
export interface DashboardSummary {
    pageCount: number;
    reports: ReportSummary[];
    latestReport?: ReportSummary;
}
export declare function loadDashboardSummary(): Promise<DashboardSummary>;
//# sourceMappingURL=Dashboard.logic.d.ts.map