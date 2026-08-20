export type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";
export interface TonePalette {
    fg: string;
    bg: string;
    border: string;
    solid: string;
}
export interface ThemePalette {
    bg: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    focus: string;
}
export interface ChartPalette {
    series: string[];
    grid: string;
    axis: string;
    track: string;
}
//# sourceMappingURL=Theme.types.d.ts.map