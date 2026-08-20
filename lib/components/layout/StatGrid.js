import * as React from "react";
import { StatTile } from "./StatTile";
import { Theme } from "../../theme/Theme.api";
/** Tiles wrap into rows of at most `columns`, so a long stat list stays readable. */
export const StatGrid = ({ tiles, columns = 5, minWidth = 190 }) => (React.createElement("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: Theme.tokens.space.md,
        maxWidth: columns * 240,
        minWidth: 0,
    } }, tiles.map((tile) => (React.createElement(StatTile, { key: tile.key, width: minWidth, label: tile.label, value: tile.value, hint: tile.hint, info: tile.info, tone: tile.tone, badge: tile.badge })))));
//# sourceMappingURL=StatGrid.js.map