import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { IndexCheck, RefinerGroup, SearchOutcome, SearchRequest, SearchRow } from "@/api/Search.types";

const INDEX_PROPERTIES = [
  "Title",
  "Path",
  "LastModifiedTime",
  "Created",
  "Author",
  "FileType",
  "contentclass",
  "SPWebUrl",
  "IsDocument",
  "ListItemID",
];

export function Search(webUrl?: string): {
  run(request: SearchRequest): Promise<SearchOutcome>;
  isIndexed(target: string): Promise<IndexCheck>;
  managedProperties(): Promise<string[]>;
} {
  return {
    async run(request: SearchRequest): Promise<SearchOutcome> {
      const started = Date.now();

      const results = await throttled(
        () =>
          getSp(webUrl).search({
            Querytext: request.queryText || "*",
            RowLimit: request.rowLimit,
            StartRow: request.startRow,
            SelectProperties: request.selectProperties,
            SortList: request.sort
              ? [{ Property: request.sort.property, Direction: request.sort.descending ? 1 : 0 }]
              : undefined,
            TrimDuplicates: request.trimDuplicates,
            EnableStemming: request.enableStemming,
            Refiners: request.refiners.length > 0 ? request.refiners.join(",") : undefined,
            RefinementFilters: request.refinementFilters.length > 0 ? request.refinementFilters : undefined,
            SourceId: request.sourceId || undefined,
            QueryTemplate: request.queryTemplate || undefined,
            Culture: request.culture,
            ClientType: "ContentSearchRegular",
          }),
        { label: "Search.run", priority: true }
      );

      const rows = (results.PrimarySearchResults ?? []) as unknown as SearchRow[];

      return {
        queryText: request.queryText,
        rows,
        properties: propertiesOf(rows, request.selectProperties),
        totalRows: results.TotalRows ?? rows.length,
        totalIncludingDuplicates: results.TotalRowsIncludingDuplicates ?? rows.length,
        elapsedMs: Date.now() - started,
        refiners: refinersOf(results.RawSearchResults),
      };
    },

    /** A single path query is the cheapest way to ask "does the index know this". */
    async isIndexed(target: string): Promise<IndexCheck> {
      const started = Date.now();
      const queryText = `Path:"${target.trim()}"`;

      const results = await throttled(
        () =>
          getSp(webUrl).search({
            Querytext: queryText,
            RowLimit: 1,
            SelectProperties: INDEX_PROPERTIES,
            TrimDuplicates: false,
            ClientType: "ContentSearchRegular",
          }),
        { label: "Search.isIndexed", priority: true }
      );

      const row = (results.PrimarySearchResults ?? [])[0] as unknown as SearchRow | undefined;

      return {
        target,
        indexed: Boolean(row),
        queryText,
        row,
        elapsedMs: Date.now() - started,
      };
    },

    async managedProperties(): Promise<string[]> {
      const results = await throttled(
        () =>
          getSp(webUrl).search({
            Querytext: "*",
            RowLimit: 1,
            TrimDuplicates: false,
            ClientType: "ContentSearchRegular",
          }),
        { label: "Search.properties", priority: true }
      );

      const row = (results.PrimarySearchResults ?? [])[0] as unknown as SearchRow | undefined;
      return row ? Object.keys(row).sort() : [];
    },
  };
}

function propertiesOf(rows: SearchRow[], requested: string[]): string[] {
  if (rows.length === 0) return requested;
  const keys = new Set<string>(requested);
  rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)));
  return [...keys];
}

interface RawResults {
  PrimaryQueryResult?: {
    RefinementResults?: { Refiners?: { Name: string; Entries: RawEntry[] }[] } | null;
  };
}

interface RawEntry {
  RefinementName: string;
  RefinementValue: string;
  RefinementToken: string;
  RefinementCount: string;
}

function refinersOf(raw: unknown): RefinerGroup[] {
  const refiners = (raw as RawResults)?.PrimaryQueryResult?.RefinementResults?.Refiners ?? [];

  return refiners.map((refiner) => ({
    name: refiner.Name,
    entries: (refiner.Entries ?? []).map((entry) => ({
      value: entry.RefinementName || entry.RefinementValue,
      token: entry.RefinementToken,
      count: Number(entry.RefinementCount ?? 0),
    })),
  }));
}
