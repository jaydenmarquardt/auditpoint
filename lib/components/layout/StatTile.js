import * as React from "react";
import { Tokens } from "../../theme/Tokens";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Badge } from "../feedback/Badge";
export const StatTile = ({ label, value, hint, tone = "neutral", badge, info, width = 160, }) => (React.createElement("div", { style: {
        background: Tokens.colour.surface,
        border: `1px solid ${Tokens.colour.border}`,
        borderRadius: Tokens.radius.md,
        padding: Tokens.space.md,
        minWidth: width,
        flex: `1 1 ${width}px`,
    } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: Tokens.space.sm } },
        React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: Tokens.font.sm, color: Tokens.colour.textMuted } },
            label,
            info && (React.createElement(TooltipHost, { content: info },
                React.createElement("i", { className: "ms-Icon ms-Icon--Info", "aria-label": info, tabIndex: 0, style: { cursor: "help" } })))),
        badge ? React.createElement(Badge, { label: badge, tone: tone }) : undefined),
    React.createElement("div", { style: { fontSize: Tokens.font.xl, fontWeight: 600, marginTop: Tokens.space.xs } }, value),
    hint && (React.createElement("div", { style: { fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, marginTop: 2 } }, hint))));
//# sourceMappingURL=StatTile.js.map