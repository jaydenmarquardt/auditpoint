import { Tokens } from "@/theme/Tokens";
import { ChartPalette, ThemePalette, Tone, TonePalette } from "@/theme/Theme.types";

const TONES: Record<Tone, TonePalette> = {
  neutral: { fg: "#3d444d", bg: "#f0f2f4", border: "#d7dbe0", solid: "#5c6470" },
  info: { fg: "#0b4f8a", bg: "#eff6fc", border: "#bcd9f2", solid: "#0f6cbd" },
  success: { fg: "#0b5c2f", bg: "#e8f5ec", border: "#b7e0c5", solid: "#0e7a3d" },
  warning: { fg: "#6f4a00", bg: "#fdf3e0", border: "#f0d6a4", solid: "#9a6700" },
  danger: { fg: "#8c1d18", bg: "#fdecea", border: "#f3c2bd", solid: "#b3261e" },
  accent: { fg: "#0b4f8a", bg: "#eff6fc", border: "#bcd9f2", solid: "#0f6cbd" },
};

const PALETTE: ThemePalette = {
  bg: Tokens.colour.bg,
  surface: Tokens.colour.surface,
  surfaceAlt: Tokens.colour.surfaceAlt,
  border: Tokens.colour.border,
  borderStrong: Tokens.colour.borderStrong,
  text: Tokens.colour.text,
  textMuted: Tokens.colour.textMuted,
  accent: Tokens.colour.accent,
  accentSoft: Tokens.colour.accentSoft,
  focus: Tokens.colour.focus,
};

const CHART: ChartPalette = {
  series: ["#0f6cbd", "#0e7a3d", "#9a6700", "#b3261e", "#6b3fa0", "#0d7d8f", "#a1439a", "#5c6470"],
  grid: "#e9ecef",
  axis: "#8b929c",
  track: "#eef0f3",
};

export function palette(): ThemePalette {
  return PALETTE;
}

export function tone(name: Tone): TonePalette {
  return TONES[name];
}

export function chart(): ChartPalette {
  return CHART;
}

export function seriesColour(index: number): string {
  return CHART.series[index % CHART.series.length];
}

export function alpha(hex: string, opacity: number): string {
  const value = hex.replace("#", "");
  const int = parseInt(value.length === 3 ? value.replace(/./g, "$&$&") : value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const Theme = { palette, tone, chart, seriesColour, alpha, tokens: Tokens };
