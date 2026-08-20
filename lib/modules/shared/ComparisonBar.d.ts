import * as React from "react";
export interface ComparisonBarProps {
    kind: string;
    /** Excluded from the list: comparing a run with itself says nothing. */
    currentId?: string;
    onChange: (data: unknown | undefined) => void;
}
/**
 * Picks an earlier run of the same report to measure this one against. The chosen
 * run's data goes back to the page, which rebuilds its own view from it.
 */
export declare const ComparisonBar: React.FC<ComparisonBarProps>;
//# sourceMappingURL=ComparisonBar.d.ts.map