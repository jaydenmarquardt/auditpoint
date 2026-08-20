import * as React from "react";
import { Modal as FluentModal } from "@fluentui/react/lib/Modal";
import { IconButton } from "./IconButton";
import { Theme } from "../../theme/Theme.api";
const WIDTHS = { medium: 640, large: 960, full: 1680 };
/** Shared detail view: header, facts, stacked sections, sticky footer actions. */
export const PreviewDialog = ({ open, title, description, facts, sections, actions, onDismiss, width = "large", headerActions, children, }) => (React.createElement(FluentModal, { isOpen: open, onDismiss: onDismiss, isBlocking: false, styles: {
        main: {
            width: "min(96vw, " + WIDTHS[width] + "px)",
            height: width === "full" ? "92vh" : undefined,
            maxHeight: "88vh",
            borderRadius: Theme.tokens.radius.md,
            display: "flex",
            flexDirection: "column",
        },
    } },
    React.createElement("header", { style: {
            display: "flex",
            alignItems: "flex-start",
            gap: Theme.tokens.space.md,
            padding: Theme.tokens.space.lg,
            borderBottom: `1px solid ${Theme.palette().border}`,
            background: Theme.palette().surface,
            position: "sticky",
            top: 0,
            zIndex: 1,
            flex: "0 0 auto",
        } },
        React.createElement("div", { style: { minWidth: 0, flex: "1 1 auto" } },
            React.createElement("h2", { style: { margin: 0, fontSize: Theme.tokens.font.lg } }, title),
            description && (React.createElement("p", { style: { margin: "4px 0 0", color: Theme.palette().textMuted, maxWidth: "80ch" } }, description))),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 2, flex: "0 0 auto" } },
            headerActions,
            React.createElement(IconButton, { iconName: "Cancel", ariaLabel: "Close", onClick: onDismiss }))),
    React.createElement("div", { style: {
            padding: Theme.tokens.space.lg,
            overflowY: "auto",
            flex: "1 1 auto",
            minHeight: 0,
            display: "grid",
            gap: Theme.tokens.space.lg,
            alignContent: "start",
        } },
        facts && facts.length > 0 && (React.createElement("dl", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                gap: Theme.tokens.space.md,
                margin: 0,
            } }, facts.map((fact) => (React.createElement("div", { key: fact.label, style: { minWidth: 0 } },
            React.createElement("dt", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, fact.label),
            React.createElement("dd", { style: { margin: "2px 0 0", fontWeight: 600, wordBreak: "break-word" } }, fact.value)))))),
        children, sections === null || sections === void 0 ? void 0 :
        sections.map((section) => (React.createElement("section", { key: section.key, style: { minWidth: 0 } },
            section.title && (React.createElement("h3", { style: { margin: `0 0 ${Theme.tokens.space.sm}`, fontSize: Theme.tokens.font.md } }, section.title)),
            section.content)))),
    actions && (React.createElement("footer", { style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: Theme.tokens.space.sm,
            padding: Theme.tokens.space.md,
            borderTop: `1px solid ${Theme.palette().border}`,
            background: Theme.palette().surface,
            position: "sticky",
            bottom: 0,
            flex: "0 0 auto",
        } }, actions))));
//# sourceMappingURL=PreviewDialog.js.map