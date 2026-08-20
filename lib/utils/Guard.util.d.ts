export declare function isNonEmptyString(value: unknown): value is string;
export declare function isDefined<T>(value: T | null | undefined): value is T;
/** Narrow an unknown thrown value into something renderable. */
export declare function toErrorMessage(error: unknown, fallback?: string): string;
/** SharePoint returns 401/403 in several shapes depending on the transport. */
export declare function isUnauthorised(error: unknown): boolean;
//# sourceMappingURL=Guard.util.d.ts.map