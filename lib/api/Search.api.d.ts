import { IndexCheck, SearchOutcome, SearchRequest } from "./Search.types";
export declare function Search(webUrl?: string): {
    run(request: SearchRequest): Promise<SearchOutcome>;
    isIndexed(target: string): Promise<IndexCheck>;
    managedProperties(): Promise<string[]>;
};
//# sourceMappingURL=Search.api.d.ts.map