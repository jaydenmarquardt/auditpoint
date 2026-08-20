import * as React from "react";
import { Button } from "../actions/Button";
import { StatesContent } from "./States.content";
import { Tokens } from "../../theme/Tokens";
export const EmptyState = ({ title = StatesContent.empty.title, description = StatesContent.empty.description, iconName = "Inbox", actionLabel, onAction, }) => (React.createElement("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: Tokens.space.sm,
        padding: `${Tokens.space.xl} ${Tokens.space.lg}`,
        border: `1px dashed ${Tokens.colour.borderStrong}`,
        borderRadius: Tokens.radius.md,
        background: Tokens.colour.surfaceAlt,
    } },
    React.createElement("i", { className: `ms-Icon ms-Icon--${iconName}`, "aria-hidden": "true", style: { fontSize: 28 } }),
    React.createElement("h2", { style: { margin: 0, fontSize: Tokens.font.lg } }, title),
    React.createElement("p", { style: { margin: 0, color: Tokens.colour.textMuted, maxWidth: "56ch" } }, description),
    onAction && React.createElement(Button, { label: actionLabel !== null && actionLabel !== void 0 ? actionLabel : StatesContent.empty.action, onClick: onAction })));
//# sourceMappingURL=Empty.state.js.map