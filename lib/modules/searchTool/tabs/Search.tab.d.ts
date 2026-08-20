import * as React from "react";
import { SearchOutcome, SearchRow } from "../../../api/Search.types";
import { Refinement } from "../SearchTool.types";
export interface SearchTabProps {
    outcome?: SearchOutcome;
    busy: boolean;
    error?: string;
    page: number;
    rowLimit: number;
    refinements: Refinement[];
    onPage: (page: number) => void;
    onRefine: (refinement: Refinement) => void;
    onRemoveRefinement: (token: string) => void;
    onClearRefiners: () => void;
    onSelect: (row: SearchRow) => void;
}
export declare const SearchTab: React.FC<SearchTabProps>;
//# sourceMappingURL=Search.tab.d.ts.map