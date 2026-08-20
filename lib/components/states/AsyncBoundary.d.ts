import * as React from "react";
import { AsyncResult } from "../../core/hooks/useAsync";
import { EmptyStateProps } from "./Empty.state";
export interface AsyncBoundaryProps<TData> {
    result: AsyncResult<TData>;
    children: (data: TData) => React.ReactNode;
    loadingLabel?: string;
    empty?: EmptyStateProps;
}
/** The one place loading/empty/error/401 are mapped. */
export declare function AsyncBoundary<TData>({ result, children, loadingLabel, empty, }: AsyncBoundaryProps<TData>): React.ReactElement;
//# sourceMappingURL=AsyncBoundary.d.ts.map