import { useCallback, useEffect, useRef, useState } from "react";
import { isUnauthorised, toErrorMessage } from "@/utils/Guard.util";

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

const defaultIsEmpty = (data: unknown): boolean => Array.isArray(data) && data.length === 0;

export function useAsync<TData>(
  operation: () => Promise<TData>,
  options: UseAsyncOptions<TData> = {}
): AsyncResult<TData> {
  const { deps = [], enabled = true, isEmpty = defaultIsEmpty as (data: TData) => boolean } = options;

  const [status, setStatus] = useState<AsyncStatus>(enabled ? "loading" : "idle");
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
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
        if (cancelled || !mountedRef.current) return;
        setData(result);
        setStatus("success");
      })
      .catch((thrown: unknown) => {
        if (cancelled || !mountedRef.current) return;
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
