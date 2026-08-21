import * as React from "react";
import { StatTileSpec } from "../../../components/Components.types";
import { AnalyticsAuditView, WindowKey } from "../AnalyticsAudit.types";
export declare const OverviewTab: React.FC<{
    view: AnalyticsAuditView;
    window: WindowKey;
    hasData: boolean;
    sampled: boolean;
    onRun: () => void;
    comparison?: React.ReactNode;
    comparisonCards?: React.ReactNode;
    previousTiles?: StatTileSpec[];
}>;
//# sourceMappingURL=Overview.tab.d.ts.map