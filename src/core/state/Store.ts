import { useEffect, useRef, useState } from "react";

export type Listener<TState> = (state: TState) => void;
export type Updater<TState> = TState | ((previous: TState) => TState);

export interface Store<TState> {
  getState(): TState;
  setState(updater: Updater<TState>): void;
  subscribe(listener: Listener<TState>): () => void;
}

/** React 17 has no useSyncExternalStore, so useStore subscribes by hand. */
export function createStore<TState>(initialState: TState): Store<TState> {
  let state = initialState;
  const listeners = new Set<Listener<TState>>();

  return {
    getState: () => state,
    setState(updater: Updater<TState>): void {
      const next =
        typeof updater === "function" ? (updater as (previous: TState) => TState)(state) : updater;
      if (Object.is(next, state)) return;
      state = next;
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener: Listener<TState>): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useStore<TState, TSlice = TState>(
  store: Store<TState>,
  selector: (state: TState) => TSlice = (state) => state as unknown as TSlice
): TSlice {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [slice, setSlice] = useState<TSlice>(() => selectorRef.current(store.getState()));
  const sliceRef = useRef(slice);
  sliceRef.current = slice;

  useEffect(() => {
    const sync = (state: TState): void => {
      const next = selectorRef.current(state);
      if (!Object.is(next, sliceRef.current)) setSlice(next);
    };
    sync(store.getState());
    return store.subscribe(sync);
  }, [store]);

  return slice;
}
