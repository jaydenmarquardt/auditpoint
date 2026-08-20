import * as React from "react";
import { Tokens } from "../../theme/Tokens";
export const PageHeader = ({ title, description, actions }) => (React.createElement("header", { style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: Tokens.space.md,
        flexWrap: "wrap",
        marginBottom: Tokens.space.lg,
    } },
    React.createElement("div", { style: { flex: "1 1 420px", minWidth: 0 } },
        React.createElement("h1", { style: { margin: 0, fontSize: Tokens.font.xl, color: Tokens.colour.text } }, title),
        description && (React.createElement("p", { style: {
                margin: "6px 0 0",
                color: Tokens.colour.textMuted,
                maxWidth: "90ch",
                lineHeight: 1.5,
                textWrap: "pretty",
            } }, description))),
    React.createElement("div", { style: { display: "flex", gap: Tokens.space.sm, flexWrap: "wrap", flex: "0 0 auto" } }, actions)));
//# sourceMappingURL=PageHeader.js.map