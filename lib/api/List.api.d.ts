import { ListApiFactory, ListDefinition } from "./List.types";
/** Define fields plus a row mapper; get a `Thing()` / `Thing(siteUrl)` factory. */
export declare function createListApi<TRow, TModel>(definition: ListDefinition<TRow, TModel>): ListApiFactory<TModel>;
//# sourceMappingURL=List.api.d.ts.map