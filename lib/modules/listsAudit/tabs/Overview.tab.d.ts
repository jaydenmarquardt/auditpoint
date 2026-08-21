import * as React from "react";
import { StatTileSpec } from "../../../components/Components.types";
import { ListsAuditConfig, ListsAuditView } from "../ListsAudit.types";
export interface OverviewTabProps {
    view: ListsAuditView;
    config: ListsAuditConfig;
    hasData: boolean;
    onRun: () => void;
    comparison?: React.ReactNode;
    comparisonCards?: React.ReactNode;
    previousTiles?: StatTileSpec[];
}
export declare const OverviewTab: React.FC<OverviewTabProps>;
//# sourceMappingURL=Overview.tab.d.ts.map