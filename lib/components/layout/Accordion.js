import * as React from "react";
import { Theme } from "../../theme/Theme.api";
export const Accordion = ({ title, subtitle, defaultOpen = false, badge, children, }) => {
    const [open, setOpen] = React.useState(defaultOpen);
    return (React.createElement("section", { style: {
            border: `1px solid ${Theme.palette().border}`,
            borderRadius: Theme.tokens.radius.sm,
            background: Theme.palette().surface,
            minWidth: 0,
        } },
        React.createElement("button", { type: "button", onClick: () => setOpen(!open), "aria-expanded": open, style: {
                display: "flex",
                alignItems: "center",
                gap: Theme.tokens.space.sm,
                width: "100%",
                minHeight: 44,
                padding: `0 ${Theme.tokens.space.md}`,
                border: "none",
                borderRadius: Theme.tokens.radius.sm,
                background: open ? Theme.palette().surfaceAlt : "transparent",
                font: "inherit",
                textAlign: "left",
                cursor: "pointer",
            } },
            React.createElement("i", { className: `ms-Icon ms-Icon--${open ? "ChevronDown" : "ChevronRight"}`, "aria-hidden": "true" }),
            React.createElement("span", { style: { fontWeight: 600 } }, title),
            subtitle && (React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, subtitle)),
            React.createElement("span", { style: { flex: "1 1 auto" } }),
            badge),
        open && React.createElement("div", { style: { padding: Theme.tokens.space.md, borderTop: `1px solid ${Theme.palette().border}` } }, children)));
};
//# sourceMappingURL=Accordion.js.map