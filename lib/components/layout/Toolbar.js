import * as React from "react";
import { Tokens } from "../../theme/Tokens";
export const Toolbar = ({ ariaLabel, children }) => (React.createElement("div", { role: "toolbar", "aria-label": ariaLabel, style: {
        display: "flex",
        alignItems: "center",
        gap: Tokens.space.sm,
        flexWrap: "wrap",
        marginBottom: Tokens.space.md,
    } }, children));
//# sourceMappingURL=Toolbar.js.map