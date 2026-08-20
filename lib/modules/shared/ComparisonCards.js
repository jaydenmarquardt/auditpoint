import * as React from "react";
import { ChartCard } from "../../components/charts/ChartCard";
import { Theme } from "../../theme/Theme.api";
/** Only tiles that actually carry a comparison can appear in these charts. */
function compared(sections) {
    return sections
        .flatMap((section) => section.tiles)
        .filter((tile) => tile.previousValue !== undefined && tile.currentValue !== undefined);
}
export const ComparisonCards = ({ sections }) => {
    const tiles = compared(sections);
    if (tiles.length === 0)
        return null;
    const change = (tile) => { var _a, _b; return ((_a = tile.currentValue) !== null && _a !== void 0 ? _a : 0) - ((_b = tile.previousValue) !== null && _b !== void 0 ? _b : 0); };
    const percent = (tile) => {
        var _a;
        const before = (_a = tile.previousValue) !== null && _a !== void 0 ? _a : 0;
        return before === 0 ? 0 : Math.round((change(tile) / Math.abs(before)) * 100);
    };
    const movers = [...tiles].sort((first, second) => Math.abs(change(second)) - Math.abs(change(first))).slice(0, 10);
    const byPercent = [...tiles]
        .filter((tile) => { var _a; return ((_a = tile.previousValue) !== null && _a !== void 0 ? _a : 0) !== 0; })
        .sort((first, second) => Math.abs(percent(second)) - Math.abs(percent(first)))
        .slice(0, 10);
    const tone = (value) => Theme.tone(value >= 0 ? "success" : "danger").solid;
    return (React.createElement("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
            minWidth: 0,
        } },
        React.createElement(ChartCard, { title: "Biggest changes", info: "Measures that moved the most between the two runs, by count.", defaultChart: "hbar", charts: ["hbar", "bar"], span: 2, valueFormatter: (value) => value.toLocaleString(), points: movers.map((tile) => ({
                label: tile.label,
                value: change(tile),
                colour: tone(change(tile)),
            })) }),
        React.createElement(ChartCard, { title: "Biggest changes by percentage", info: "The same comparison as a share of the earlier run, so small measures are not drowned out.", defaultChart: "hbar", charts: ["hbar", "bar"], span: 2, valueFormatter: (value) => `${value}%`, points: byPercent.map((tile) => ({
                label: tile.label,
                value: percent(tile),
                colour: tone(percent(tile)),
            })) })));
};
//# sourceMappingURL=ComparisonCards.js.map