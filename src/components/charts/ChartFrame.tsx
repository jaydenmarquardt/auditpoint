import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { ChartFrameProps } from "@/components/charts/Charts.types";

export const ChartFrame: React.FC<ChartFrameProps> = ({ title, ariaLabel, children, footer }) => (
  <figure
    aria-label={ariaLabel}
    style={{
      margin: 0,
      display: "grid",
      gap: Theme.tokens.space.sm,
      width: "100%",
      minWidth: 0,
    }}
  >
    {title && (
      <figcaption style={{ fontSize: Theme.tokens.font.sm, fontWeight: 600, color: Theme.palette().textMuted }}>
        {title}
      </figcaption>
    )}
    {children}
    {footer}
  </figure>
);
