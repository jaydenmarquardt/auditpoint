import { SearchOutcome, SearchRow } from "../../api/Search.types";
export interface SearchFormState {
    keywords: string;
    fileTypes: string;
    contentClass: string;
    path: string;
    author: string;
    modifiedAfter: string;
    modifiedBefore: string;
    extraKql: string;
    useRawQuery: boolean;
    rawQuery: string;
    queryTemplate: string;
    sourceId: string;
    selectProperties: string;
    refiners: string;
    sortProperty: string;
    sortDescending: boolean;
    rowLimit: number;
    trimDuplicates: boolean;
    enableStemming: boolean;
    xrankTerms: string;
    xrankBoost: number;
}
export interface Refinement {
    refiner: string;
    token: string;
    value: string;
}
export interface HistoryEntry {
    iso: string;
    queryText: string;
    totalRows: number;
    elapsedMs: number;
}
export interface SearchState {
    outcome?: SearchOutcome;
    selectedRow?: SearchRow;
    refinements: Refinement[];
    page: number;
}
//# sourceMappingURL=SearchTool.types.d.ts.map