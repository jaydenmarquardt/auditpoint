import * as React from "react";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { Tokens } from "../../theme/Tokens";
export const Button = ({ label, onClick, variant = "default", iconName, disabled, busy, ariaLabel, type = "button", href, newTab, title, }) => {
    var _a;
    const shared = {
        text: label,
        onClick,
        iconProps: iconName ? { iconName } : undefined,
        disabled: disabled || busy,
        ariaLabel: ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : label,
        title: (_a = title !== null && title !== void 0 ? title : ariaLabel) !== null && _a !== void 0 ? _a : label,
        href,
        target: href && newTab ? "_blank" : undefined,
        rel: href && newTab ? "noopener noreferrer" : undefined,
        type,
        styles: {
            root: {
                minHeight: Tokens.hitTarget,
                borderRadius: Tokens.radius.sm,
                paddingInline: Tokens.space.md,
            },
        },
    };
    if (variant === "primary")
        return React.createElement(PrimaryButton, Object.assign({}, shared));
    if (variant === "danger") {
        return (React.createElement(PrimaryButton, Object.assign({}, shared, { styles: {
                root: Object.assign(Object.assign({}, shared.styles.root), { backgroundColor: Tokens.colour.danger, borderColor: Tokens.colour.danger }),
                rootHovered: { backgroundColor: "#8e1e18", borderColor: "#8e1e18" },
            } })));
    }
    if (variant === "subtle") {
        return (React.createElement(DefaultButton, Object.assign({}, shared, { styles: {
                root: Object.assign(Object.assign({}, shared.styles.root), { border: "none", background: "transparent" }),
                rootHovered: { background: Tokens.colour.accentSoft },
            } })));
    }
    return React.createElement(DefaultButton, Object.assign({}, shared));
};
//# sourceMappingURL=Button.js.map