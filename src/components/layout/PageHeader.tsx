import * as React from "react";
import { Tokens } from "@/theme/Tokens";
import { PageHeaderProps } from "@/components/Components.types";

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => (
  <header
    style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: Tokens.space.md,
      flexWrap: "wrap",
      marginBottom: Tokens.space.lg,
    }}
  >
    <div style={{ flex: "1 1 420px", minWidth: 0 }}>
      <h1 style={{ margin: 0, fontSize: Tokens.font.xl, color: Tokens.colour.text }}>{title}</h1>
      {description && (
        <p
          style={{
            margin: "6px 0 0",
            color: Tokens.colour.textMuted,
            maxWidth: "90ch",
            lineHeight: 1.5,
            textWrap: "pretty",
          }}
        >
          {description}
        </p>
      )}
    </div>
    <div style={{ display: "flex", gap: Tokens.space.sm, flexWrap: "wrap", flex: "0 0 auto" }}>{actions}</div>
  </header>
);
