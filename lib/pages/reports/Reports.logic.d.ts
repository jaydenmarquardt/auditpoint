import { ReportSummary } from "../../api/Reports.types";
import { SelectOption } from "../../components/Components.types";
export declare function kindLabel(kind: string): string;
export declare function kindOptions(reports: ReportSummary[]): SelectOption[];
export declare function filterReports(reports: ReportSummary[], search: string, kind: string): ReportSummary[];
/** Unfinished runs are only useful to the person who started them. */
export declare function visibleReports(reports: ReportSummary[], userLogin: string): ReportSummary[];
export declare function ownedBy(report: ReportSummary, userLogin: string): boolean;
//# sourceMappingURL=Reports.logic.d.ts.map