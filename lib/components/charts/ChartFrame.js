import * as React from "react";
import { Theme } from "../../theme/Theme.api";
export const ChartFrame = ({ title, ariaLabel, children, footer }) => (React.createElement("figure", { "aria-label": ariaLabel, style: {
        margin: 0,
        display: "grid",
        gap: Theme.tokens.space.sm,
        width: "100%",
        minWidth: 0,
    } },
    title && (React.createElement("figcaption", { style: { fontSize: Theme.tokens.font.sm, fontWeight: 600, color: Theme.palette().textMuted } }, title)),
    children,
    footer));
//# sourceMappingURL=ChartFrame.js.map