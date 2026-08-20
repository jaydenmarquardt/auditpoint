import * as React from "react";
import { Tokens } from "@/theme/Tokens";
import { CardProps } from "@/components/Components.types";

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  padded = true,
  onClick,
  children,
}) => {
  const body = (
    <>
      {(title || actions) && (
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: Tokens.space.md,
            marginBottom: children ? Tokens.space.md : 0,
          }}
        >
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: Tokens.font.lg, color: Tokens.colour.text }}>{title}</h3>
            )}
            {subtitle && (
              <p style={{ margin: "4px 0 0", fontSize: Tokens.font.sm, color: Tokens.colour.textMuted }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </>
  );

  const style: React.CSSProperties = {
    background: Tokens.colour.surface,
    border: `1px solid ${Tokens.colour.border}`,
    borderRadius: Tokens.radius.md,
    padding: padded ? Tokens.space.lg : 0,
    boxShadow: Tokens.shadow.sm,
    textAlign: "left",
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
  };

  if (!onClick) return <section style={style}>{body}</section>;

  return (
    <button type="button" onClick={onClick} style={{ ...style, cursor: "pointer", font: "inherit" }}>
      {body}
    </button>
  );
};
