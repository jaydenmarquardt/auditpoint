import * as React from "react";
import { Theme } from "@/theme/Theme.api";

export const ChartEmpty: React.FC<{ label?: string }> = ({ label = "No data" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 96,
      borderRadius: Theme.tokens.radius.sm,
      border: `1px dashed ${Theme.palette().border}`,
      color: Theme.palette().textMuted,
      fontSize: Theme.tokens.font.sm,
    }}
  >
    {label}
  </div>
);
