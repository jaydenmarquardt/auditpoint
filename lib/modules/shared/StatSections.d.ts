import * as React from "react";
import { StatTileSpec } from "../../components/Components.types";
export interface StatSectionSpec {
    title: string;
    /** Tile keys in this section, in the order they should read. */
    keys: string[];
}
/**
 * Splits a flat tile list into titled sections. Anything a module forgets to place
 * lands in the last section rather than disappearing.
 */
export declare function sectionsFrom(tiles: StatTileSpec[], spec: StatSectionSpec[]): {
    title: string;
    tiles: StatTileSpec[];
}[];
/**
 * Pairs each tile with the same measure from another run. Values are formatted for
 * reading, so the number is read back out of the string rather than threaded through
 * every module twice.
 */
export declare function compareTiles(current: StatTileSpec[], previous?: StatTileSpec[]): StatTileSpec[];
export declare const StatSections: React.FC<{
    sections: {
        title: string;
        tiles: StatTileSpec[];
    }[];
}>;
//# sourceMappingURL=StatSections.d.ts.map