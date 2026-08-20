import * as React from "react";
import { Button } from "@/components/actions/Button";
import { StatesContent } from "@/components/states/States.content";
import { Tokens } from "@/theme/Tokens";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = StatesContent.empty.title,
  description = StatesContent.empty.description,
  iconName = "Inbox",
  actionLabel,
  onAction,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: Tokens.space.sm,
      padding: `${Tokens.space.xl} ${Tokens.space.lg}`,
      border: `1px dashed ${Tokens.colour.borderStrong}`,
      borderRadius: Tokens.radius.md,
      background: Tokens.colour.surfaceAlt,
    }}
  >
    <i className={`ms-Icon ms-Icon--${iconName}`} aria-hidden="true" style={{ fontSize: 28 }} />
    <h2 style={{ margin: 0, fontSize: Tokens.font.lg }}>{title}</h2>
    <p style={{ margin: 0, color: Tokens.colour.textMuted, maxWidth: "56ch" }}>{description}</p>
    {onAction && <Button label={actionLabel ?? StatesContent.empty.action} onClick={onAction} />}
  </div>
);
