import * as React from "react";
import { HistoryEntry } from "../SearchTool.types";
export interface HistoryTabProps {
    entries: HistoryEntry[];
    onRerun: (queryText: string) => void;
    onClear: () => void;
}
export declare const HistoryTab: React.FC<HistoryTabProps>;
//# sourceMappingURL=History.tab.d.ts.map