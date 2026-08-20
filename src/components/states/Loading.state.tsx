import * as React from "react";
import { Spinner } from "@/components/feedback/Spinner";
import { StatesContent } from "@/components/states/States.content";
import { Tokens } from "@/theme/Tokens";

export interface LoadingStateProps {
  label?: string;
  /** Fills the available height rather than sitting inline. */
  full?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ label, full = true }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: full ? 240 : undefined,
      padding: Tokens.space.lg,
    }}
  >
    <Spinner label={label ?? StatesContent.loading.label} />
  </div>
);
