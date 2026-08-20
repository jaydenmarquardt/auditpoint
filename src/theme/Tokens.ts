export const Tokens = {
  colour: {
    bg: "#f5f6f8",
    surface: "#ffffff",
    surfaceAlt: "#fafbfc",
    border: "#e1e4e8",
    borderStrong: "#c8ccd2",
    text: "#1b1f23",
    textMuted: "#5c6470",
    accent: "#0f6cbd",
    accentSoft: "#eff6fc",
    success: "#0e7a3d",
    warning: "#9a6700",
    danger: "#b3261e",
    focus: "#0f6cbd",
  },
  radius: { sm: "4px", md: "8px", lg: "12px" },
  space: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" },
  font: {
    family: '"Segoe UI", system-ui, -apple-system, sans-serif',
    sm: "12px",
    md: "14px",
    lg: "18px",
    xl: "24px",
  },
  shadow: {
    sm: "0 1px 2px rgba(16,24,40,0.06)",
    md: "0 4px 12px rgba(16,24,40,0.10)",
  },
  /** WCAG 2.2 AA target size minimum. */
  hitTarget: 44,
  zIndex: { sidebar: 10, topbar: 20, fullscreen: 1000000 },
} as const;
