import * as React from "react";
import { Tokens } from "@/theme/Tokens";
import { FieldRowProps } from "@/components/Components.types";

export const FieldRow: React.FC<FieldRowProps> = ({ minColumnWidth = 220, children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}px, 100%), 1fr))`,
      gap: Tokens.space.md,
      alignItems: "end",
    }}
  >
    {children}
  </div>
);
