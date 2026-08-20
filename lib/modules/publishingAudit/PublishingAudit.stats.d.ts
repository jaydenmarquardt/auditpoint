import * as React from "react";
import { StatSectionSpec } from "../shared/StatSections";
import { StatTileSpec } from "../../components/Components.types";
import { PublishingAuditConfig, PublishingAuditView } from "./PublishingAudit.types";
export declare function statTiles(view: PublishingAuditView, config: PublishingAuditConfig): StatTileSpec[];
export declare const PublishingAuditStats: React.FC<{
    view: PublishingAuditView;
    config: PublishingAuditConfig;
    previousTiles?: StatTileSpec[];
}>;
/** Grouped so the overview answers one question at a time. */
export declare const STAT_SECTIONS: StatSectionSpec[];
//# sourceMappingURL=PublishingAudit.stats.d.ts.map