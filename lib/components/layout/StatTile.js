import * as React from "react";
import { Tokens } from "../../theme/Tokens";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Badge } from "../feedback/Badge";
export const StatTile = ({ label, value, hint, tone = "neutral", badge, info, iconName, unavailable, width = 160, }) => (React.createElement("div", { style: {
        background: Tokens.colour.surface,
        border: `1px solid ${Tokens.colour.border}`,
        borderRadius: Tokens.radius.md,
        padding: Tokens.space.md,
        minWidth: width,
        flex: `1 1 ${width}px`,
        opacity: unavailable ? 0.55 : 1,
    }, "aria-disabled": unavailable ? true : undefined },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: Tokens.space.sm } },
        React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: Tokens.font.sm, color: Tokens.colour.textMuted } },
            label,
            info && (React.createElement(TooltipHost, { content: info },
                React.createElement("i", { className: "ms-Icon ms-Icon--Info", "aria-label": info, tabIndex: 0, style: { cursor: "help" } })))),
        badge && !unavailable ? React.createElement(Badge, { label: badge, tone: tone }) : undefined),
    React.createElement("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: Tokens.space.xs,
            fontSize: Tokens.font.xl,
            fontWeight: 600,
            marginTop: Tokens.space.xs,
        } },
        iconName && (React.createElement("i", { className: `ms-Icon ms-Icon--${iconName}`, "aria-hidden": "true", style: { fontSize: Tokens.font.lg, color: Tokens.colour.textMuted } })),
        unavailable ? "NA" : value),
    hint && (React.createElement("div", { style: { fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, marginTop: 2 } }, hint))));
//# sourceMappingURL=StatTile.js.map