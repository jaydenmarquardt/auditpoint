import * as React from "react";
import { StatSectionSpec } from "../shared/StatSections";
import { StatTileSpec } from "../../components/Components.types";
import { ContentAuditView } from "./ContentAudit.types";
export declare function statTiles(view: ContentAuditView): StatTileSpec[];
export declare const ContentAuditStats: React.FC<{
    view: ContentAuditView;
    previousTiles?: StatTileSpec[];
}>;
/** Grouped so the overview answers one question at a time. */
export declare const STAT_SECTIONS: StatSectionSpec[];
//# sourceMappingURL=ContentAudit.stats.d.ts.map