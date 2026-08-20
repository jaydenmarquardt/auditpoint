import * as React from "react";
import { StatSectionSpec } from "../shared/StatSections";
import { StatTileSpec } from "../../components/Components.types";
import { ImagesAuditView } from "./ImagesAudit.types";
export declare function statTiles(view: ImagesAuditView): StatTileSpec[];
export declare const ImagesAuditStats: React.FC<{
    view: ImagesAuditView;
    previousTiles?: StatTileSpec[];
}>;
/** Grouped so the overview answers one question at a time. */
export declare const STAT_SECTIONS: StatSectionSpec[];
//# sourceMappingURL=ImagesAudit.stats.d.ts.map