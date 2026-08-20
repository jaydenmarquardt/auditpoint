import { useCallback, useEffect, useRef, useState } from "react";
import { isUnauthorised, toErrorMessage } from "../../utils/Guard.util";
const defaultIsEmpty = (data) => Array.isArray(data) && data.length === 0;
export function useAsync(operation, options = {}) {
    const { deps = [], enabled = true, isEmpty = defaultIsEmpty } = options;
    const [status, setStatus] = useState(enabled ? "loading" : "idle");
    const [data, setData] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [nonce, setNonce] = useState(0);
    const operationRef = useRef(operation);
    operationRef.current = operation;
    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    useEffect(() => {
        if (!enabled) {
            setStatus("idle");
            return;
        }
        let cancelled = false;
        setStatus("loading");
        setError(undefined);
        operationRef
            .current()
            .then((result) => {
            if (cancelled || !mountedRef.current)
                return;
            setData(result);
            setStatus("success");
        })
            .catch((thrown) => {
            if (cancelled || !mountedRef.current)
                return;
            setError(toErrorMessage(thrown));
            setStatus(isUnauthorised(thrown) ? "unauthorised" : "error");
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, nonce, ...deps]);
    const reload = useCallback(() => setNonce((value) => value + 1), []);
    return {
        status,
        data,
        error,
        isEmpty: status === "success" && data !== undefined && isEmpty(data),
        reload,
    };
}
//# sourceMappingURL=useAsync.js.map