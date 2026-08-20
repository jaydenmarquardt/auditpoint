import * as React from "react";
import { Tokens } from "../../theme/Tokens";
export const Card = ({ title, subtitle, actions, padded = true, onClick, children, }) => {
    const body = (React.createElement(React.Fragment, null,
        (title || actions) && (React.createElement("header", { style: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: Tokens.space.md,
                marginBottom: children ? Tokens.space.md : 0,
            } },
            React.createElement("div", null,
                title && (React.createElement("h3", { style: { margin: 0, fontSize: Tokens.font.lg, color: Tokens.colour.text } }, title)),
                subtitle && (React.createElement("p", { style: { margin: "4px 0 0", fontSize: Tokens.font.sm, color: Tokens.colour.textMuted } }, subtitle))),
            actions)),
        children));
    const style = {
        background: Tokens.colour.surface,
        border: `1px solid ${Tokens.colour.border}`,
        borderRadius: Tokens.radius.md,
        padding: padded ? Tokens.space.lg : 0,
        boxShadow: Tokens.shadow.sm,
        textAlign: "left",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
    };
    if (!onClick)
        return React.createElement("section", { style: style }, body);
    return (React.createElement("button", { type: "button", onClick: onClick, style: Object.assign(Object.assign({}, style), { cursor: "pointer", font: "inherit" }) }, body));
};
//# sourceMappingURL=Card.js.map