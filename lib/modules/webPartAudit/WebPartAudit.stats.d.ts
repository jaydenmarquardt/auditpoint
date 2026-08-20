import * as React from "react";
import { StatTileSpec } from "../../components/Components.types";
import { StatSectionSpec } from "../shared/StatSections";
import { WebPartAuditView } from "./WebPartAudit.types";
interface Tile {
    key: string;
    label: string;
    value: string;
    info: string;
    tone?: "warning";
    badge?: string;
    iconName?: string;
}
export declare function statTiles(view: WebPartAuditView): Tile[];
export declare const WebPartAuditStats: React.FC<{
    view: WebPartAuditView;
    previousTiles?: StatTileSpec[];
}>;
/** Grouped so the overview answers one question at a time. */
export declare const STAT_SECTIONS: StatSectionSpec[];
export {};
//# sourceMappingURL=WebPartAudit.stats.d.ts.map