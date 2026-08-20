import * as React from "react";
import { Theme } from "@/theme/Theme.api";
import { BadgeProps, BadgeTone } from "@/components/Components.types";

const DEFAULT_ICONS: Record<BadgeTone, string> = {
  neutral: "CircleRing",
  info: "Info",
  accent: "Info",
  success: "CompletedSolid",
  warning: "Warning",
  danger: "ErrorBadge",
};

export const Badge: React.FC<BadgeProps> = ({ label, tone = "neutral", iconName, showIcon = true }) => {
  const palette = Theme.tone(tone);
  const icon = iconName ?? (showIcon ? DEFAULT_ICONS[tone] : undefined);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Theme.tokens.space.xs,
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: Theme.tokens.font.sm,
        fontWeight: 600,
        lineHeight: "18px",
        color: palette.fg,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {icon ? <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" /> : undefined}
      {label}
    </span>
  );
};
