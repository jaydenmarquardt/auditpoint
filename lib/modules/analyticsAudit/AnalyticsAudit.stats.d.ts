import * as React from "react";
import { StatTileSpec } from "../../components/Components.types";
import { StatSectionSpec } from "../shared/StatSections";
import { AnalyticsAuditView, WindowKey } from "./AnalyticsAudit.types";
export declare function statTiles(view: AnalyticsAuditView, window: WindowKey): StatTileSpec[];
export declare const STAT_SECTIONS: StatSectionSpec[];
export declare const AnalyticsAuditStats: React.FC<{
    view: AnalyticsAuditView;
    window: WindowKey;
    previousTiles?: StatTileSpec[];
}>;
//# sourceMappingURL=AnalyticsAudit.stats.d.ts.map