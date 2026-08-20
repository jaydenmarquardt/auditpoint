import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
import { StatTileSpec } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { ComparisonCards } from "@/modules/shared/ComparisonCards";

export interface StatSectionSpec {
  title: string;
  /** Tile keys in this section, in the order they should read. */
  keys: string[];
}

/**
 * Splits a flat tile list into titled sections. Anything a module forgets to place
 * lands in the last section rather than disappearing.
 */
export function sectionsFrom(
  tiles: StatTileSpec[],
  spec: StatSectionSpec[]
): { title: string; tiles: StatTileSpec[] }[] {
  const placed = new Set<string>();

  const sections = spec.map((section) => {
    const chosen = section.keys
      .map((key) => tiles.filter((tile) => tile.key === key)[0])
      .filter((tile): tile is StatTileSpec => Boolean(tile));

    chosen.forEach((tile) => placed.add(tile.key));
    return { title: section.title, tiles: chosen };
  });

  const left = tiles.filter((tile) => !placed.has(tile.key));
  if (left.length > 0 && sections.length > 0) sections[sections.length - 1].tiles.push(...left);

  return sections.filter((section) => section.tiles.length > 0);
}

/**
 * Pairs each tile with the same measure from another run. Values are formatted for
 * reading, so the number is read back out of the string rather than threaded through
 * every module twice.
 */
export function compareTiles(current: StatTileSpec[], previous?: StatTileSpec[]): StatTileSpec[] {
  if (!previous) return current;

  return current.map((tile) => {
    const before = previous.filter((entry) => entry.key === tile.key)[0];
    if (!before || tile.unavailable || before.unavailable) return tile;

    const now = numberIn(tile.value);
    const then = numberIn(before.value);
    if (now === undefined || then === undefined) return tile;

    return { ...tile, currentValue: now, previousValue: then };
  });
}

function numberIn(value: string): number | undefined {
  const match = /-?[\d,.]+/.exec(value ?? "");
  if (!match) return undefined;

  const parsed = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const StatSections: React.FC<{ sections: { title: string; tiles: StatTileSpec[] }[] }> = ({ sections }) => (
  <div style={{ display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 }}>
    <ComparisonCards sections={sections} />

    {sections.map((section) => (
      <StatGrid key={section.title} title={section.title} tiles={section.tiles} minWidth={180} />
    ))}
  </div>
);
