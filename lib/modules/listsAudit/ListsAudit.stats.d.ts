import * as React from "react";
import { StatTileSpec } from "../../components/Components.types";
import { ListsAuditConfig, ListsAuditView } from "./ListsAudit.types";
export interface ListsAuditStatsProps {
    view: ListsAuditView;
    config: ListsAuditConfig;
}
export declare function statTiles({ view, config }: ListsAuditStatsProps): StatTileSpec[];
export declare const ListsAuditStats: React.FC<ListsAuditStatsProps>;
//# sourceMappingURL=ListsAudit.stats.d.ts.map