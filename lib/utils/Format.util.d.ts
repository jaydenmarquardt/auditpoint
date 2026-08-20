export declare function formatDate(value: string | Date | undefined | null): string;
export declare function formatDateTime(value: string | Date | undefined | null): string;
export declare function formatNumber(value: number | undefined | null): string;
export declare function formatBytes(bytes: number | undefined | null): string;
export declare function formatDuration(ms: number): string;
export declare function pluralise(count: number, singular: string, plural?: string): string;
/** Rough time remaining from the rate so far. Good enough to set expectations. */
export declare function estimateRemaining(startedIso: string | undefined, processed: number, total?: number): string;
export declare function durationBetween(startIso?: string, endIso?: string): string;
//# sourceMappingURL=Format.util.d.ts.map