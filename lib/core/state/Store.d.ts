export type Listener<TState> = (state: TState) => void;
export type Updater<TState> = TState | ((previous: TState) => TState);
export interface Store<TState> {
    getState(): TState;
    setState(updater: Updater<TState>): void;
    subscribe(listener: Listener<TState>): () => void;
}
/** React 17 has no useSyncExternalStore, so useStore subscribes by hand. */
export declare function createStore<TState>(initialState: TState): Store<TState>;
export declare function useStore<TState, TSlice = TState>(store: Store<TState>, selector?: (state: TState) => TSlice): TSlice;
//# sourceMappingURL=Store.d.ts.map