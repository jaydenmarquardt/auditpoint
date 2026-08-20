import * as React from "react";
import { Tokens } from "../../theme/Tokens";
export const FieldRow = ({ minColumnWidth = 220, children }) => (React.createElement("div", { style: {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnWidth}px, 100%), 1fr))`,
        gap: Tokens.space.md,
        alignItems: "end",
    } }, children));
//# sourceMappingURL=FieldRow.js.map