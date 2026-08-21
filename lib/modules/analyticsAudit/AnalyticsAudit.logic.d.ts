import { AnalyticsAuditData, AnalyticsAuditView, AnalyticsEntry, WindowKey } from "./AnalyticsAudit.types";
export declare function windowOf(entry: AnalyticsEntry, window: WindowKey): {
    views: number;
    unique: number;
    timeSpentSeconds: number;
};
export declare function buildView(data: Partial<AnalyticsAuditData> | undefined, window: WindowKey): AnalyticsAuditView;
export declare function formatDuration(seconds: number): string;
export declare function windowLabel(window: WindowKey): string;
//# sourceMappingURL=AnalyticsAudit.logic.d.ts.map