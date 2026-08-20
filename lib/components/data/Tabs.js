import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { Theme } from "../../theme/Theme.api";
export const Tabs = ({ items, selectedKey, onChange, ariaLabel }) => (React.createElement("div", { style: { minWidth: 0 } },
    React.createElement(Pivot, { "aria-label": ariaLabel, selectedKey: selectedKey, onLinkClick: (item) => {
            if ((item === null || item === void 0 ? void 0 : item.props.itemKey) && onChange)
                onChange(item.props.itemKey);
        }, overflowBehavior: "menu", styles: {
            root: {
                display: "flex",
                gap: 4,
                padding: 4,
                background: Theme.palette().surfaceAlt,
                border: `1px solid ${Theme.palette().border}`,
                borderRadius: Theme.tokens.radius.md,
                overflowX: "auto",
            },
            link: {
                height: 36,
                lineHeight: "36px",
                padding: `0 ${Theme.tokens.space.md}`,
                borderRadius: Theme.tokens.radius.sm,
                color: Theme.palette().textMuted,
                selectors: {
                    ":hover": { background: Theme.palette().surface, color: Theme.palette().text },
                    "::before": { display: "none" },
                },
            },
            linkIsSelected: {
                background: Theme.palette().surface,
                color: Theme.palette().accent,
                fontWeight: 600,
                border: `1px solid ${Theme.palette().border}`,
                boxShadow: Theme.tokens.shadow.sm,
                selectors: {
                    "::before": {
                        display: "block",
                        height: 3,
                        bottom: 2,
                        left: 12,
                        right: 12,
                        borderRadius: 3,
                        background: Theme.palette().accent,
                    },
                },
            },
            count: { color: "inherit" },
        } }, items.map((item) => (React.createElement(PivotItem, { key: item.key, itemKey: item.key, headerText: item.label, itemIcon: item.iconName, itemCount: item.count },
        React.createElement("div", { style: { paddingTop: Theme.tokens.space.lg, minWidth: 0 } }, item.content)))))));
//# sourceMappingURL=Tabs.js.map