import * as React from "react";
import { EmptyState } from "./Empty.state";
import { ErrorState } from "./Error.state";
import { LoadingState } from "./Loading.state";
import { UnauthorisedState } from "./Unauthorised.state";
/** The one place loading/empty/error/401 are mapped. */
export function AsyncBoundary({ result, children, loadingLabel, empty, }) {
    if (result.status === "idle" || result.status === "loading") {
        return React.createElement(LoadingState, { label: loadingLabel });
    }
    if (result.status === "unauthorised")
        return React.createElement(UnauthorisedState, null);
    if (result.status === "error") {
        return React.createElement(ErrorState, { detail: result.error, onRetry: result.reload });
    }
    if (result.isEmpty)
        return React.createElement(EmptyState, Object.assign({ onAction: result.reload }, empty));
    return React.createElement(React.Fragment, null, result.data !== undefined ? children(result.data) : undefined);
}
//# sourceMappingURL=AsyncBoundary.js.map