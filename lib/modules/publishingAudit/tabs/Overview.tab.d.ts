import * as React from "react";
import { StatTileSpec } from "../../../components/Components.types";
import { PublishingAuditConfig, PublishingAuditView } from "../PublishingAudit.types";
export declare const OverviewTab: React.FC<{
    view: PublishingAuditView;
    config: PublishingAuditConfig;
    hasData: boolean;
    onRun: () => void;
    comparison?: React.ReactNode;
    comparisonCards?: React.ReactNode;
    previousTiles?: StatTileSpec[];
}>;
//# sourceMappingURL=Overview.tab.d.ts.map