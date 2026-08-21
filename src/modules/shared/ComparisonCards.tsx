import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { StatTileSpec } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";

export interface ComparisonCardsProps {
  sections: { title: string; tiles: StatTileSpec[] }[];
}

/** Only tiles that actually carry a comparison can appear in these charts. */
function compared(sections: ComparisonCardsProps["sections"]): StatTileSpec[] {
  return sections
    .flatMap((section) => section.tiles)
    .filter((tile) => tile.previousValue !== undefined && tile.currentValue !== undefined);
}

export const ComparisonCards: React.FC<ComparisonCardsProps> = ({ sections }) => {
  const tiles = compared(sections);
  if (tiles.length === 0) return null;

  const change = (tile: StatTileSpec): number => (tile.currentValue ?? 0) - (tile.previousValue ?? 0);
  const percent = (tile: StatTileSpec): number => {
    const before = tile.previousValue ?? 0;
    return before === 0 ? 0 : Math.round((change(tile) / Math.abs(before)) * 100);
  };

  const movers = [...tiles].sort((first, second) => Math.abs(change(second)) - Math.abs(change(first))).slice(0, 10);
  const byPercent = [...tiles]
    .filter((tile) => (tile.previousValue ?? 0) !== 0)
    .sort((first, second) => Math.abs(percent(second)) - Math.abs(percent(first)))
    .slice(0, 10);

  const tone = (value: number): string => Theme.tone(value >= 0 ? "success" : "danger").solid;

  const before = Theme.tone("neutral").solid;
  const after = Theme.tone("info").solid;

  return (
    <>
      <ChartCard
        title="Before and after"
        info="The measures that moved most, each shown as it was and as it is now."
        defaultChart="bar"
        charts={["bar", "hbar"]}
        span={2}
        selectable={false}
        valueFormatter={(value) => value.toLocaleString()}
        points={movers.flatMap((tile) => [
          { label: `${tile.label} — was`, value: tile.previousValue ?? 0, colour: before },
          { label: `${tile.label} — now`, value: tile.currentValue ?? 0, colour: after },
        ])}
      />

      <ChartCard
        title="Biggest changes"
        info="Measures that moved the most between the two runs, by count."
        defaultChart="hbar"
        charts={["hbar", "bar"]}
        span={2}
        selectable={false}
        valueFormatter={(value) => value.toLocaleString()}
        points={movers.map((tile) => ({
          label: tile.label,
          value: change(tile),
          colour: tone(change(tile)),
        }))}
      />

      <ChartCard
        title="Change by percentage"
        info="The same comparison as a share of the earlier run, so small measures are not drowned out."
        defaultChart="hbar"
        charts={["hbar", "bar"]}
        span={2}
        selectable={false}
        valueFormatter={(value) => `${value}%`}
        points={byPercent.map((tile) => ({
          label: tile.label,
          value: percent(tile),
          colour: tone(percent(tile)),
        }))}
      />
    </>
  );
};
