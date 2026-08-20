import * as React from "react";
import { StatTile } from "./StatTile";
import { Theme } from "../../theme/Theme.api";
/** Tiles fill the width of their container, wrapping as the space runs out. */
export const StatGrid = ({ tiles, minWidth = 190, title }) => (React.createElement("section", { style: { minWidth: 0, width: "100%" } },
    title && (React.createElement("h3", { style: {
            margin: `0 0 ${Theme.tokens.space.sm}`,
            fontSize: Theme.tokens.font.md,
            color: Theme.palette().textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
        } }, title)),
    React.createElement("div", { style: {
            display: "grid",
            // Tiles share the full width rather than stopping at a fixed column count.
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${minWidth}px, 100%), 1fr))`,
            gap: Theme.tokens.space.md,
            width: "100%",
            minWidth: 0,
        } }, tiles.map((tile) => (React.createElement(StatTile, { key: tile.key, width: minWidth, label: tile.label, value: tile.value, hint: tile.hint, info: tile.info, tone: tile.tone, badge: tile.badge, iconName: tile.iconName, unavailable: tile.unavailable, previousValue: tile.previousValue, currentValue: tile.currentValue }))))));
//# sourceMappingURL=StatGrid.js.map