import * as React from "react";
import { AsyncResult } from "@/core/hooks/useAsync";
import { EmptyState, EmptyStateProps } from "@/components/states/Empty.state";
import { ErrorState } from "@/components/states/Error.state";
import { LoadingState } from "@/components/states/Loading.state";
import { UnauthorisedState } from "@/components/states/Unauthorised.state";

export interface AsyncBoundaryProps<TData> {
  result: AsyncResult<TData>;
  children: (data: TData) => React.ReactNode;
  loadingLabel?: string;
  empty?: EmptyStateProps;
}

/** The one place loading/empty/error/401 are mapped. */
export function AsyncBoundary<TData>({
  result,
  children,
  loadingLabel,
  empty,
}: AsyncBoundaryProps<TData>): React.ReactElement {
  if (result.status === "idle" || result.status === "loading") {
    return <LoadingState label={loadingLabel} />;
  }

  if (result.status === "unauthorised") return <UnauthorisedState />;

  if (result.status === "error") {
    return <ErrorState detail={result.error} onRetry={result.reload} />;
  }

  if (result.isEmpty) return <EmptyState onAction={result.reload} {...empty} />;

  return <>{result.data !== undefined ? children(result.data) : undefined}</>;
}
