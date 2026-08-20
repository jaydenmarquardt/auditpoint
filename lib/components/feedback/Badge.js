import * as React from "react";
import { Theme } from "../../theme/Theme.api";
const DEFAULT_ICONS = {
    neutral: "CircleRing",
    info: "Info",
    accent: "Info",
    success: "CompletedSolid",
    warning: "Warning",
    danger: "ErrorBadge",
};
export const Badge = ({ label, tone = "neutral", iconName, showIcon = true }) => {
    const palette = Theme.tone(tone);
    const icon = iconName !== null && iconName !== void 0 ? iconName : (showIcon ? DEFAULT_ICONS[tone] : undefined);
    return (React.createElement("span", { style: {
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
        } },
        icon ? React.createElement("i", { className: `ms-Icon ms-Icon--${icon}`, "aria-hidden": "true" }) : undefined,
        label));
};
//# sourceMappingURL=Badge.js.map