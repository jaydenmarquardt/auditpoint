import * as React from "react";
import { StatTileSpec } from "../../components/Components.types";
import { LinkAuditConfig, LinkAuditView } from "./LinkAudit.types";
export interface StatSection {
    key: string;
    title: string;
    tiles: StatTileSpec[];
}
/**
 * Four questions, four grids: what was read, where the links point, how they were
 * written, and what is wrong. One flat wall of twenty numbers answered none of them.
 */
export declare function statSections(view: LinkAuditView, config?: LinkAuditConfig): StatSection[];
export declare const LinkAuditStats: React.FC<{
    view: LinkAuditView;
    config?: LinkAuditConfig;
}>;
//# sourceMappingURL=LinkAudit.stats.d.ts.map