import * as React from "react";
import { Spinner } from "../../components/feedback/Spinner";
import { Theme } from "../../theme/Theme.api";
const BAR = {
    background: Theme.palette().surfaceAlt,
    borderRadius: Theme.tokens.radius.sm,
    animation: "auditpoint-pulse 1.4s ease-in-out infinite",
};
/** Stands in for the report while it is read, in roughly the shape it will take. */
export const ReportSkeleton = ({ label }) => (React.createElement("section", { "aria-busy": "true", "aria-label": label, style: {
        border: `1px solid ${Theme.palette().border}`,
        borderRadius: Theme.tokens.radius.md,
        background: Theme.palette().surface,
        padding: Theme.tokens.space.lg,
        display: "grid",
        gap: Theme.tokens.space.md,
    } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm } },
        React.createElement(Spinner, { size: "small" }),
        React.createElement("strong", null, label)),
    React.createElement("div", { style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))",
            gap: Theme.tokens.space.md,
        } }, [0, 1, 2, 3, 4, 5].map((tile) => (React.createElement("div", { key: tile, style: Object.assign(Object.assign({}, BAR), { height: 78, animationDelay: `${tile * 90}ms` }) })))),
    React.createElement("div", { style: { display: "grid", gap: 8 } }, [0, 1, 2, 3].map((row) => (React.createElement("div", { key: row, style: Object.assign(Object.assign({}, BAR), { height: 14, width: `${90 - row * 12}%`, animationDelay: `${row * 120}ms` }) }))))));
//# sourceMappingURL=ReportSkeleton.js.map