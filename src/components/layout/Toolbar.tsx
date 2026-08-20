import * as React from "react";
import { Tokens } from "@/theme/Tokens";
import { ToolbarProps } from "@/components/Components.types";

export const Toolbar: React.FC<ToolbarProps> = ({ ariaLabel, children }) => (
  <div
    role="toolbar"
    aria-label={ariaLabel}
    style={{
      display: "flex",
      alignItems: "center",
      gap: Tokens.space.sm,
      flexWrap: "wrap",
      marginBottom: Tokens.space.md,
    }}
  >
    {children}
  </div>
);
