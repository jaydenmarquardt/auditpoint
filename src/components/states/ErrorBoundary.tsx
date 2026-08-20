import * as React from "react";
import { ErrorState } from "@/components/states/Error.state";
import { StatesContent } from "@/components/states/States.content";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  message?: string;
}

/** Keeps one broken dashboard from taking the whole shell down with it. */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {};

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { message: error.message };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("[app] render error", error, info.componentStack);
  }

  public render(): React.ReactNode {
    if (!this.state.message) return this.props.children;

    return (
      <ErrorState
        title={StatesContent.crash.title}
        description={StatesContent.crash.description}
        detail={this.state.message}
        onRetry={() => window.location.reload()}
      />
    );
  }
}
