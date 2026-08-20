import { SearchRequest } from "@/api/Search.types";
import { readLocal, writeLocal } from "@/utils/Storage.util";
import { HistoryEntry, Refinement, SearchFormState } from "@/modules/searchTool/SearchTool.types";

const HISTORY_KEY = "search-history";
const HISTORY_LIMIT = 25;

export const DEFAULT_PROPERTIES = [
  "Title",
  "Path",
  "FileType",
  "LastModifiedTime",
  "Author",
  "contentclass",
  "SPWebUrl",
];

export const SOURCE_IDS: { key: string; text: string }[] = [
  { key: "", text: "Default" },
  { key: "e7ec8cee-ded8-43c9-beb5-436b54b31e84", text: "Local SharePoint documents" },
  { key: "8413cd39-2156-4e00-b54d-11efd9abdb89", text: "Local SharePoint items" },
  { key: "5dc9f503-801e-4ced-8a2c-5d1237132419", text: "Conversations" },
  { key: "b09a7990-05ea-4af9-81ef-edfab16c4e31", text: "Local people" },
];

export const defaultForm: SearchFormState = {
  keywords: "",
  fileTypes: "",
  contentClass: "",
  path: "",
  author: "",
  modifiedAfter: "",
  modifiedBefore: "",
  extraKql: "",
  useRawQuery: false,
  rawQuery: "",
  queryTemplate: "",
  sourceId: "",
  selectProperties: DEFAULT_PROPERTIES.join(","),
  refiners: "FileType,contentclass",
  sortProperty: "",
  sortDescending: true,
  rowLimit: 50,
  trimDuplicates: true,
  enableStemming: true,
  xrankTerms: "",
  xrankBoost: 100,
};

/** Turns the form into KQL, so the user can always see what was sent. */
export function buildQueryText(form: SearchFormState): string {
  if (form.useRawQuery) return withXrank(form.rawQuery.trim(), form);

  const parts: string[] = [];

  if (form.keywords.trim()) parts.push(form.keywords.trim());
  if (form.path.trim()) parts.push(`Path:"${form.path.trim()}*"`);
  if (form.author.trim()) parts.push(`Author:"${form.author.trim()}"`);
  if (form.contentClass.trim()) parts.push(`contentclass:${form.contentClass.trim()}`);

  const fileTypes = splitList(form.fileTypes);
  if (fileTypes.length === 1) parts.push(`FileType:${fileTypes[0]}`);
  if (fileTypes.length > 1) parts.push(`(${fileTypes.map((type) => `FileType:${type}`).join(" OR ")})`);

  if (form.modifiedAfter) parts.push(`LastModifiedTime>=${form.modifiedAfter}`);
  if (form.modifiedBefore) parts.push(`LastModifiedTime<=${form.modifiedBefore}`);
  if (form.extraKql.trim()) parts.push(`(${form.extraKql.trim()})`);

  return withXrank(parts.length === 0 ? "*" : parts.join(" AND "), form);
}

/** XRANK boosts matching results without excluding the rest. */
function withXrank(queryText: string, form: SearchFormState): string {
  const terms = form.xrankTerms.trim();
  if (!terms) return queryText;

  const base = queryText || "*";
  return `(${base}) XRANK(cb=${form.xrankBoost}) ${terms}`;
}

/**
 * Refiners are filtered by name and value. Range tokens are passed through as is,
 * since only search can interpret them.
 */
export function buildRefinementFilters(refinements: Refinement[]): string[] {
  const byRefiner = new Map<string, Refinement[]>();
  refinements.forEach((entry) => byRefiner.set(entry.refiner, [...(byRefiner.get(entry.refiner) ?? []), entry]));

  return [...byRefiner.entries()].map(([refiner, entries]) => {
    const ranges = entries.filter((entry) => isRange(entry.token));
    if (ranges.length > 0) return ranges.length === 1 ? ranges[0].token : `or(${ranges.map((entry) => entry.token).join(",")})`;

    const values = entries.map((entry) => `"${entry.value.replace(/"/g, '\\"')}"`);
    return values.length === 1 ? `${refiner}:equals(${values[0]})` : `${refiner}:or(${values.join(",")})`;
  });
}

function isRange(token: string): boolean {
  return token.startsWith("range(");
}

export function toRequest(form: SearchFormState, page: number, refinements: Refinement[]): SearchRequest {
  return {
    queryText: buildQueryText(form),
    rowLimit: form.rowLimit,
    startRow: page * form.rowLimit,
    selectProperties: splitList(form.selectProperties),
    sort: form.sortProperty.trim()
      ? { property: form.sortProperty.trim(), descending: form.sortDescending }
      : undefined,
    trimDuplicates: form.trimDuplicates,
    enableStemming: form.enableStemming,
    refiners: splitList(form.refiners),
    refinementFilters: buildRefinementFilters(refinements),
    sourceId: form.sourceId,
    queryTemplate: form.queryTemplate.trim() || undefined,
  };
}

export function splitList(value: string): string[] {
  return value
    .split(/[,\s;]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function readHistory(): HistoryEntry[] {
  return readLocal<HistoryEntry[]>(HISTORY_KEY, []);
}

export function addHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...readHistory().filter((item) => item.queryText !== entry.queryText)].slice(
    0,
    HISTORY_LIMIT
  );
  writeLocal(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  writeLocal(HISTORY_KEY, []);
  return [];
}

export function toIsoDate(value: Date | undefined): string {
  return value ? value.toISOString().slice(0, 10) : "";
}

export function fromIsoDate(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function pathOf(row: Record<string, string>): string {
  return row.Path ?? row.OriginalPath ?? "";
}
