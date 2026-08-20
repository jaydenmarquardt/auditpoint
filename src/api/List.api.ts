import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { ListApi, ListApiFactory, ListDefinition, ListQuery } from "@/api/List.types";

const PAGE_SIZE = 500;

/** Define fields plus a row mapper; get a `Thing()` / `Thing(siteUrl)` factory. */
export function createListApi<TRow, TModel>(
  definition: ListDefinition<TRow, TModel>
): ListApiFactory<TModel> {
  return (webUrl?: string): ListApi<TModel> => {
    const list = (): ReturnType<ReturnType<typeof getSp>["web"]["lists"]["getByTitle"]> =>
      getSp(webUrl).web.lists.getByTitle(definition.title);

    const base = (query?: ListQuery): ReturnType<ReturnType<typeof list>["items"]["select"]> => {
      let items = list().items.select(...definition.select);
      if (definition.expand?.length) items = items.expand(...definition.expand);
      if (query?.filter) items = items.filter(query.filter);
      if (query?.orderBy) items = items.orderBy(query.orderBy.field, query.orderBy.ascending !== false);
      items = items.top(query?.top ?? PAGE_SIZE);
      return items;
    };

    return {
      webUrl,
      title: definition.title,

      async getItems(query?: ListQuery): Promise<TModel[]> {
        if (!query?.all) {
          const rows = (await throttled(() => base(query)(), {
            label: `${definition.title}.getItems`,
          })) as TRow[];
          return rows.map(definition.map);
        }

        const collected: TModel[] = [];

        for await (const page of base(query)) {
          collected.push(...(page as TRow[]).map(definition.map));
        }

        return collected;
      },

      async getItem(id: number): Promise<TModel> {
        const item = list().items.getById(id).select(...definition.select);
        const row = (await throttled(
          () => (definition.expand?.length ? item.expand(...definition.expand)() : item()),
          { label: `${definition.title}.getItem`, priority: true }
        )) as TRow;
        return definition.map(row);
      },

      async count(filter?: string): Promise<number> {
        const items = filter ? list().items.filter(filter) : list().items;
        const rows = (await throttled(() => items.select("Id").top(5000)(), {
          label: `${definition.title}.count`,
        })) as { Id: number }[];
        return rows.length;
      },

      async exists(): Promise<boolean> {
        try {
          await throttled(() => list().select("Id")(), { label: `${definition.title}.exists`, priority: true });
          return true;
        } catch {
          return false;
        }
      },
    };
  };
}
