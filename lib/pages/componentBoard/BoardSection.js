import * as React from "react";
import { Card } from "../../components/layout/Card";
import { Theme } from "../../theme/Theme.api";
export const BoardSection = ({ name, summary, children }) => (React.createElement(Card, { title: name, subtitle: summary },
    React.createElement("div", { style: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: Theme.tokens.space.md,
            padding: Theme.tokens.space.md,
            background: Theme.palette().surfaceAlt,
            border: `1px solid ${Theme.palette().border}`,
            borderRadius: Theme.tokens.radius.sm,
        } }, children)));
//# sourceMappingURL=BoardSection.js.map