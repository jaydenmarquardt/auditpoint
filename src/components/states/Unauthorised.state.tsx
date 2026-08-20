import * as React from "react";
import { Button } from "@/components/actions/Button";
import { StatesContent } from "@/components/states/States.content";
import { Tokens } from "@/theme/Tokens";

export interface UnauthorisedStateProps {
  title?: string;
  description?: string;
  userName?: string;
  appName?: string;
}

export const UnauthorisedState: React.FC<UnauthorisedStateProps> = ({
  title = StatesContent.unauthorised.title,
  description,
  userName,
  appName = "This app",
}) => (
  <div
    role="alert"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: Tokens.space.sm,
      padding: Tokens.space.xl,
      background: Tokens.colour.surface,
      border: `1px solid ${Tokens.colour.border}`,
      borderRadius: Tokens.radius.md,
    }}
  >
    <i className="ms-Icon ms-Icon--Lock" aria-hidden="true" style={{ fontSize: 32 }} />
    <h2 style={{ margin: 0, fontSize: Tokens.font.lg }}>{title}</h2>
    <p style={{ margin: 0, color: Tokens.colour.textMuted, maxWidth: "60ch" }}>
      {description ?? StatesContent.unauthorised.description(appName)}
    </p>
    {userName && (
      <p style={{ margin: 0, fontSize: Tokens.font.sm, color: Tokens.colour.textMuted }}>
        Signed in as {userName}
      </p>
    )}
    <Button
      label={StatesContent.unauthorised.action}
      variant="primary"
      onClick={() => window.location.reload()}
    />
  </div>
);
