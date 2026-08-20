import { SearchRequest } from "../../api/Search.types";
import { HistoryEntry, Refinement, SearchFormState } from "./SearchTool.types";
export declare const DEFAULT_PROPERTIES: string[];
export declare const SOURCE_IDS: {
    key: string;
    text: string;
}[];
export declare const defaultForm: SearchFormState;
/** Turns the form into KQL, so the user can always see what was sent. */
export declare function buildQueryText(form: SearchFormState): string;
/**
 * Refiners are filtered by name and value. Range tokens are passed through as is,
 * since only search can interpret them.
 */
export declare function buildRefinementFilters(refinements: Refinement[]): string[];
export declare function toRequest(form: SearchFormState, page: number, refinements: Refinement[]): SearchRequest;
export declare function splitList(value: string): string[];
export declare function readHistory(): HistoryEntry[];
export declare function addHistory(entry: HistoryEntry): HistoryEntry[];
export declare function clearHistory(): HistoryEntry[];
export declare function toIsoDate(value: Date | undefined): string;
export declare function fromIsoDate(value: string): Date | undefined;
export declare function pathOf(row: Record<string, string>): string;
//# sourceMappingURL=SearchTool.logic.d.ts.map