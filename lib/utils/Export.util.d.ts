export declare function downloadJson(name: string, data: unknown): void;
export declare function downloadCsv<TRow extends Record<string, unknown>>(name: string, rows: TRow[]): void;
/**
 * A counts block above the rows, so the sheet opens on the same figures the tool
 * shows rather than needing a pivot to get them.
 */
export declare function downloadCsvWithSummary<TRow extends Record<string, unknown>>(name: string, summary: [string, string | number][], rows: TRow[]): void;
//# sourceMappingURL=Export.util.d.ts.map