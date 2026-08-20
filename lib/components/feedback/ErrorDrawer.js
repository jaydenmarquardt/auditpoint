import * as React from "react";
import { Drawer } from "../actions/Drawer";
import { Button } from "../actions/Button";
import { Badge } from "./Badge";
import { Theme } from "../../theme/Theme.api";
export const ErrorDrawer = ({ open, title, message, context, onDismiss, onRetry, retryLabel = "Retry", }) => {
    const [copied, setCopied] = React.useState(false);
    const payload = `${title}\n${message}\n${(context !== null && context !== void 0 ? context : []).map((row) => `${row.label}: ${row.value}`).join("\n")}`;
    return (React.createElement(Drawer, { open: open, title: title, onDismiss: onDismiss, footer: React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.sm } },
            onRetry && React.createElement(Button, { label: retryLabel, variant: "primary", iconName: "Refresh", onClick: onRetry }),
            React.createElement(Button, { label: copied ? "Copied" : "Copy detail", iconName: "Copy", onClick: () => {
                    void navigator.clipboard.writeText(payload);
                    setCopied(true);
                } })) },
        React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
            React.createElement(Badge, { label: "Failed", tone: "danger" }),
            React.createElement("pre", { style: {
                    margin: 0,
                    padding: Theme.tokens.space.md,
                    background: Theme.tone("danger").bg,
                    border: `1px solid ${Theme.tone("danger").border}`,
                    borderRadius: Theme.tokens.radius.sm,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: Theme.tokens.font.sm,
                } }, message),
            context && context.length > 0 && (React.createElement("dl", { style: { display: "grid", gridTemplateColumns: "140px 1fr", gap: Theme.tokens.space.xs, margin: 0 } }, context.map((row) => (React.createElement(React.Fragment, { key: row.label },
                React.createElement("dt", { style: { color: Theme.palette().textMuted } }, row.label),
                React.createElement("dd", { style: { margin: 0, wordBreak: "break-word" } }, row.value)))))))));
};
//# sourceMappingURL=ErrorDrawer.js.map