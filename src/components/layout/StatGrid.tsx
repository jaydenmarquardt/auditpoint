import * as React from "react";
import { StatTile } from "@/components/layout/StatTile";
import { Theme } from "@/theme/Theme.api";
import { StatGridProps } from "@/components/Components.types";

/** Tiles fill the width of their container, wrapping as the space runs out. */
export const StatGrid: React.FC<StatGridProps> = ({ tiles, minWidth = 190, title }) => (
  <section style={{ minWidth: 0, width: "100%" }}>
    {title && (
      <h3
        style={{
          margin: `0 0 ${Theme.tokens.space.sm}`,
          fontSize: Theme.tokens.font.md,
          color: Theme.palette().textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </h3>
    )}

    <div
      style={{
        display: "grid",
        // Tiles share the full width rather than stopping at a fixed column count.
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minWidth}px, 100%), 1fr))`,
        gap: Theme.tokens.space.md,
        width: "100%",
        minWidth: 0,
      }}
    >
      {tiles.map((tile) => (
        <StatTile
          key={tile.key}
          width={minWidth}
          label={tile.label}
          value={tile.value}
          hint={tile.hint}
          info={tile.info}
          tone={tile.tone}
          badge={tile.badge}
          iconName={tile.iconName}
          unavailable={tile.unavailable}
          previousValue={tile.previousValue}
          currentValue={tile.currentValue}
        />
      ))}
    </div>
  </section>
);
