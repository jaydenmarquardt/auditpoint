import * as React from "react";
import { Button } from "@/components/actions/Button";
import { StatesContent } from "@/components/states/States.content";
import { Tokens } from "@/theme/Tokens";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  detail?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = StatesContent.error.title,
  description = StatesContent.error.description,
  detail,
  onRetry,
}) => (
  <div
    role="alert"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: Tokens.space.sm,
      padding: Tokens.space.lg,
      border: `1px solid ${Tokens.colour.danger}`,
      borderRadius: Tokens.radius.md,
      background: "#fdecea",
    }}
  >
    <h2 style={{ margin: 0, fontSize: Tokens.font.lg, color: "#8c1d18" }}>{title}</h2>
    <p style={{ margin: 0, color: Tokens.colour.text, maxWidth: "72ch" }}>{description}</p>
    {detail && (
      <details>
        <summary style={{ cursor: "pointer" }}>{StatesContent.error.detailToggle}</summary>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: Tokens.font.sm,
            background: Tokens.colour.surface,
            padding: Tokens.space.sm,
            borderRadius: Tokens.radius.sm,
            margin: `${Tokens.space.sm} 0 0`,
          }}
        >
          {detail}
        </pre>
      </details>
    )}
    {onRetry && (
      <div>
        <Button label={StatesContent.error.action} variant="primary" onClick={onRetry} iconName="Refresh" />
      </div>
    )}
  </div>
);
