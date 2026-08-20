export interface ListQuery {
  filter?: string;
  orderBy?: { field: string; ascending?: boolean };
  top?: number;
  /** Keeps paging when the list is larger than `top`. */
  all?: boolean;
}

export interface ListDefinition<TRow, TModel> {
  title: string;
  select: string[];
  expand?: string[];
  map: (row: TRow) => TModel;
}

export interface ListApi<TModel> {
  webUrl?: string;
  title: string;
  getItems(query?: ListQuery): Promise<TModel[]>;
  getItem(id: number): Promise<TModel>;
  count(filter?: string): Promise<number>;
  exists(): Promise<boolean>;
}

export type ListApiFactory<TModel> = (webUrl?: string) => ListApi<TModel>;
