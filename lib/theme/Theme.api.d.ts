import { ChartPalette, ThemePalette, Tone, TonePalette } from "./Theme.types";
export declare function palette(): ThemePalette;
export declare function tone(name: Tone): TonePalette;
export declare function chart(): ChartPalette;
export declare function seriesColour(index: number): string;
export declare function alpha(hex: string, opacity: number): string;
export declare const Theme: {
    palette: typeof palette;
    tone: typeof tone;
    chart: typeof chart;
    seriesColour: typeof seriesColour;
    alpha: typeof alpha;
    tokens: {
        readonly colour: {
            readonly bg: "#f5f6f8";
            readonly surface: "#ffffff";
            readonly surfaceAlt: "#fafbfc";
            readonly border: "#e1e4e8";
            readonly borderStrong: "#c8ccd2";
            readonly text: "#1b1f23";
            readonly textMuted: "#5c6470";
            readonly accent: "#0f6cbd";
            readonly accentSoft: "#eff6fc";
            readonly success: "#0e7a3d";
            readonly warning: "#9a6700";
            readonly danger: "#b3261e";
            readonly focus: "#0f6cbd";
        };
        readonly radius: {
            readonly sm: "4px";
            readonly md: "8px";
            readonly lg: "12px";
        };
        readonly space: {
            readonly xs: "4px";
            readonly sm: "8px";
            readonly md: "16px";
            readonly lg: "24px";
            readonly xl: "32px";
        };
        readonly font: {
            readonly family: "\"Segoe UI\", system-ui, -apple-system, sans-serif";
            readonly sm: "12px";
            readonly md: "14px";
            readonly lg: "18px";
            readonly xl: "24px";
        };
        readonly shadow: {
            readonly sm: "0 1px 2px rgba(16,24,40,0.06)";
            readonly md: "0 4px 12px rgba(16,24,40,0.10)";
        };
        readonly hitTarget: 44;
        readonly zIndex: {
            readonly sidebar: 10;
            readonly topbar: 20;
            readonly fullscreen: 1000000;
        };
    };
};
//# sourceMappingURL=Theme.api.d.ts.map