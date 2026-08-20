import * as React from "react";
import { StatSectionSpec } from "../shared/StatSections";
import { StatTileSpec } from "../../components/Components.types";
import { ListsAuditConfig, ListsAuditView } from "./ListsAudit.types";
export interface ListsAuditStatsProps {
    view: ListsAuditView;
    config: ListsAuditConfig;
}
export declare function statTiles({ view, config }: ListsAuditStatsProps): StatTileSpec[];
export declare const ListsAuditStats: React.FC<ListsAuditStatsProps & {
    previousTiles?: StatTileSpec[];
}>;
/** Grouped so the overview answers one question at a time. */
export declare const STAT_SECTIONS: StatSectionSpec[];
//# sourceMappingURL=ListsAudit.stats.d.ts.map