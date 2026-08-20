import * as React from "react";
import { Button } from "../actions/Button";
import { StatesContent } from "./States.content";
import { Tokens } from "../../theme/Tokens";
export const ErrorState = ({ title = StatesContent.error.title, description = StatesContent.error.description, detail, onRetry, }) => (React.createElement("div", { role: "alert", style: {
        display: "flex",
        flexDirection: "column",
        gap: Tokens.space.sm,
        padding: Tokens.space.lg,
        border: `1px solid ${Tokens.colour.danger}`,
        borderRadius: Tokens.radius.md,
        background: "#fdecea",
    } },
    React.createElement("h2", { style: { margin: 0, fontSize: Tokens.font.lg, color: "#8c1d18" } }, title),
    React.createElement("p", { style: { margin: 0, color: Tokens.colour.text, maxWidth: "72ch" } }, description),
    detail && (React.createElement("details", null,
        React.createElement("summary", { style: { cursor: "pointer" } }, StatesContent.error.detailToggle),
        React.createElement("pre", { style: {
                whiteSpace: "pre-wrap",
                fontSize: Tokens.font.sm,
                background: Tokens.colour.surface,
                padding: Tokens.space.sm,
                borderRadius: Tokens.radius.sm,
                margin: `${Tokens.space.sm} 0 0`,
            } }, detail))),
    onRetry && (React.createElement("div", null,
        React.createElement(Button, { label: StatesContent.error.action, variant: "primary", onClick: onRetry, iconName: "Refresh" })))));
//# sourceMappingURL=Error.state.js.map