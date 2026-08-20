import * as React from "react";
import { StatTile } from "@/components/layout/StatTile";
import { Theme } from "@/theme/Theme.api";
import { StatGridProps } from "@/components/Components.types";

/** Tiles wrap into rows of at most `columns`, so a long stat list stays readable. */
export const StatGrid: React.FC<StatGridProps> = ({ tiles, columns = 5, minWidth = 190 }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: Theme.tokens.space.md,
      maxWidth: columns * 240,
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
      />
    ))}
  </div>
);
