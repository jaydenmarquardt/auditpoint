import * as React from "react";
import { ListsAuditConfig, ListsAuditView } from "../ListsAudit.types";
export interface OverviewTabProps {
    view: ListsAuditView;
    config: ListsAuditConfig;
    hasData: boolean;
    onRun: () => void;
}
export declare const OverviewTab: React.FC<OverviewTabProps>;
//# sourceMappingURL=Overview.tab.d.ts.map