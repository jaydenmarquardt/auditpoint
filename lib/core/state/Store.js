import { useEffect, useRef, useState } from "react";
/** React 17 has no useSyncExternalStore, so useStore subscribes by hand. */
export function createStore(initialState) {
    let state = initialState;
    const listeners = new Set();
    return {
        getState: () => state,
        setState(updater) {
            const next = typeof updater === "function" ? updater(state) : updater;
            if (Object.is(next, state))
                return;
            state = next;
            listeners.forEach((listener) => listener(state));
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
}
export function useStore(store, selector = (state) => state) {
    const selectorRef = useRef(selector);
    selectorRef.current = selector;
    const [slice, setSlice] = useState(() => selectorRef.current(store.getState()));
    const sliceRef = useRef(slice);
    sliceRef.current = slice;
    useEffect(() => {
        const sync = (state) => {
            const next = selectorRef.current(state);
            if (!Object.is(next, sliceRef.current))
                setSlice(next);
        };
        sync(store.getState());
        return store.subscribe(sync);
    }, [store]);
    return slice;
}
//# sourceMappingURL=Store.js.map