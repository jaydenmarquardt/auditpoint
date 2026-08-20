export type AsyncStatus = "idle" | "loading" | "success" | "error" | "unauthorised";
export interface AsyncResult<TData> {
    status: AsyncStatus;
    data: TData | undefined;
    error: string | undefined;
    isEmpty: boolean;
    reload: () => void;
}
export interface UseAsyncOptions<TData> {
    /** Deps that should retrigger the load. Same contract as useEffect deps. */
    deps?: readonly unknown[];
    enabled?: boolean;
    isEmpty?: (data: TData) => boolean;
}
export declare function useAsync<TData>(operation: () => Promise<TData>, options?: UseAsyncOptions<TData>): AsyncResult<TData>;
//# sourceMappingURL=useAsync.d.ts.map