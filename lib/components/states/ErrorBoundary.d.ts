import * as React from "react";
interface ErrorBoundaryProps {
    children: React.ReactNode;
}
interface ErrorBoundaryState {
    message?: string;
}
/** Keeps one broken dashboard from taking the whole shell down with it. */
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map