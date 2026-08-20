import * as React from "react";
import { ErrorState } from "./Error.state";
import { StatesContent } from "./States.content";
/** Keeps one broken dashboard from taking the whole shell down with it. */
export class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {};
    }
    static getDerivedStateFromError(error) {
        return { message: error.message };
    }
    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error("[app] render error", error, info.componentStack);
    }
    render() {
        if (!this.state.message)
            return this.props.children;
        return (React.createElement(ErrorState, { title: StatesContent.crash.title, description: StatesContent.crash.description, detail: this.state.message, onRetry: () => window.location.reload() }));
    }
}
//# sourceMappingURL=ErrorBoundary.js.map