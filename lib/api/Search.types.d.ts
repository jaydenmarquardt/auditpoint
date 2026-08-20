export interface SearchSort {
    property: string;
    descending: boolean;
}
export interface SearchRequest {
    queryText: string;
    rowLimit: number;
    startRow: number;
    selectProperties: string[];
    sort?: SearchSort;
    trimDuplicates: boolean;
    enableStemming: boolean;
    refiners: string[];
    refinementFilters: string[];
    sourceId?: string;
    queryTemplate?: string;
    culture?: number;
}
export type SearchRow = Record<string, string>;
export interface RefinerGroup {
    name: string;
    entries: {
        value: string;
        token: string;
        count: number;
    }[];
}
export interface SearchOutcome {
    queryText: string;
    rows: SearchRow[];
    properties: string[];
    totalRows: number;
    totalIncludingDuplicates: number;
    elapsedMs: number;
    refiners: RefinerGroup[];
}
export interface IndexCheck {
    target: string;
    indexed: boolean;
    queryText: string;
    row?: SearchRow;
    elapsedMs: number;
}
//# sourceMappingURL=Search.types.d.ts.map