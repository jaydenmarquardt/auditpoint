export declare function delay(ms: number): Promise<void>;
/** Bounded fan-out, unbounded Promise.all gets the tenant to 429. */
export declare function mapWithConcurrency<TIn, TOut>(items: readonly TIn[], limit: number, worker: (item: TIn, index: number) => Promise<TOut>): Promise<TOut[]>;
export declare function retry<T>(operation: () => Promise<T>, attempts?: number, backoffMs?: number): Promise<T>;
//# sourceMappingURL=Async.util.d.ts.map