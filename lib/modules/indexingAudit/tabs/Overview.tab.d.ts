import * as React from "react";
import { IndexingAuditConfig, IndexingAuditView } from "../IndexingAudit.types";
export interface OverviewTabProps {
    view: IndexingAuditView;
    config: IndexingAuditConfig;
    hasData: boolean;
    onRun: () => void;
}
export declare const OverviewTab: React.FC<OverviewTabProps>;
//# sourceMappingURL=Overview.tab.d.ts.map