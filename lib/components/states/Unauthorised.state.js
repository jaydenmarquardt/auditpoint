import * as React from "react";
import { Button } from "../actions/Button";
import { StatesContent } from "./States.content";
import { Tokens } from "../../theme/Tokens";
export const UnauthorisedState = ({ title = StatesContent.unauthorised.title, description, userName, appName = "This app", }) => (React.createElement("div", { role: "alert", style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: Tokens.space.sm,
        padding: Tokens.space.xl,
        background: Tokens.colour.surface,
        border: `1px solid ${Tokens.colour.border}`,
        borderRadius: Tokens.radius.md,
    } },
    React.createElement("i", { className: "ms-Icon ms-Icon--Lock", "aria-hidden": "true", style: { fontSize: 32 } }),
    React.createElement("h2", { style: { margin: 0, fontSize: Tokens.font.lg } }, title),
    React.createElement("p", { style: { margin: 0, color: Tokens.colour.textMuted, maxWidth: "60ch" } }, description !== null && description !== void 0 ? description : StatesContent.unauthorised.description(appName)),
    userName && (React.createElement("p", { style: { margin: 0, fontSize: Tokens.font.sm, color: Tokens.colour.textMuted } },
        "Signed in as ",
        userName)),
    React.createElement(Button, { label: StatesContent.unauthorised.action, variant: "primary", onClick: () => window.location.reload() })));
//# sourceMappingURL=Unauthorised.state.js.map