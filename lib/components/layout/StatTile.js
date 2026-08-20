import * as React from "react";
import { Tokens } from "../../theme/Tokens";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Theme } from "../../theme/Theme.api";
export const StatTile = ({ label, value, hint, tone = "neutral", badge, info, iconName, unavailable, previousValue, currentValue, width = 160, }) => (React.createElement("div", { style: {
        border: `1px solid ${badge && !unavailable ? Theme.tone(tone).border : Tokens.colour.border}`,
        boxShadow: badge && !unavailable ? `inset 0 0 0 1px ${Theme.tone(tone).border}` : undefined,
        background: badge && !unavailable ? Theme.tone(tone).bg : Tokens.colour.surface,
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
        badge && !unavailable ? (React.createElement("span", { style: {
                fontSize: 10,
                lineHeight: "14px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: Theme.tone(tone).fg,
                whiteSpace: "nowrap",
                alignSelf: "start",
            } }, badge)) : undefined),
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
    previousValue !== undefined && currentValue !== undefined && !unavailable && (React.createElement(Delta, { current: currentValue, previous: previousValue })),
    hint && (React.createElement("div", { style: { fontSize: Tokens.font.sm, color: Tokens.colour.textMuted, marginTop: 2 } }, hint))));
/** Change against the run being compared: direction, difference and percentage. */
const Delta = ({ current, previous }) => {
    const difference = current - previous;
    const percent = previous === 0 ? undefined : Math.round((difference / Math.abs(previous)) * 100);
    const tone = difference === 0 ? "neutral" : difference > 0 ? "success" : "danger";
    const palette = Theme.tone(tone);
    return (React.createElement("div", { style: { marginTop: 6, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } },
        React.createElement("span", { style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "1px 8px",
                borderRadius: 999,
                background: palette.bg,
                border: `1px solid ${palette.border}`,
                color: palette.fg,
                fontSize: Tokens.font.sm,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
            } },
            React.createElement("i", { className: `ms-Icon ms-Icon--${difference === 0 ? "Remove" : difference > 0 ? "CaretSolidUp" : "CaretSolidDown"}`, "aria-hidden": "true", style: { fontSize: 10 } }),
            difference > 0 ? "+" : "",
            difference.toLocaleString(),
            percent === undefined ? "" : ` · ${percent > 0 ? "+" : ""}${percent}%`),
        React.createElement("span", { style: { color: Tokens.colour.textMuted, fontSize: Tokens.font.sm, whiteSpace: "nowrap" } },
            "was ",
            previous.toLocaleString())));
};
//# sourceMappingURL=StatTile.js.map