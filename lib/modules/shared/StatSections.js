import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { Theme } from "../../theme/Theme.api";
import { ComparisonCards } from "./ComparisonCards";
/**
 * Splits a flat tile list into titled sections. Anything a module forgets to place
 * lands in the last section rather than disappearing.
 */
export function sectionsFrom(tiles, spec) {
    const placed = new Set();
    const sections = spec.map((section) => {
        const chosen = section.keys
            .map((key) => tiles.filter((tile) => tile.key === key)[0])
            .filter((tile) => Boolean(tile));
        chosen.forEach((tile) => placed.add(tile.key));
        return { title: section.title, tiles: chosen };
    });
    const left = tiles.filter((tile) => !placed.has(tile.key));
    if (left.length > 0 && sections.length > 0)
        sections[sections.length - 1].tiles.push(...left);
    return sections.filter((section) => section.tiles.length > 0);
}
/**
 * Pairs each tile with the same measure from another run. Values are formatted for
 * reading, so the number is read back out of the string rather than threaded through
 * every module twice.
 */
export function compareTiles(current, previous) {
    if (!previous)
        return current;
    return current.map((tile) => {
        const before = previous.filter((entry) => entry.key === tile.key)[0];
        if (!before || tile.unavailable || before.unavailable)
            return tile;
        const now = numberIn(tile.value);
        const then = numberIn(before.value);
        if (now === undefined || then === undefined)
            return tile;
        return Object.assign(Object.assign({}, tile), { currentValue: now, previousValue: then });
    });
}
function numberIn(value) {
    const match = /-?[\d,.]+/.exec(value !== null && value !== void 0 ? value : "");
    if (!match)
        return undefined;
    const parsed = Number(match[0].replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
}
export const StatSections = ({ sections }) => (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 } },
    React.createElement(ComparisonCards, { sections: sections }),
    sections.map((section) => (React.createElement(StatGrid, { key: section.title, title: section.title, tiles: section.tiles, minWidth: 180 })))));
//# sourceMappingURL=StatSections.js.map