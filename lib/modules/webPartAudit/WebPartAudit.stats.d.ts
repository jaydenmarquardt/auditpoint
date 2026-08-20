import * as React from "react";
import { WebPartAuditView } from "./WebPartAudit.types";
interface Tile {
    key: string;
    label: string;
    value: string;
    info: string;
    tone?: "warning";
    badge?: string;
}
export declare function statTiles(view: WebPartAuditView): Tile[];
export declare const WebPartAuditStats: React.FC<{
    view: WebPartAuditView;
}>;
export {};
//# sourceMappingURL=WebPartAudit.stats.d.ts.map