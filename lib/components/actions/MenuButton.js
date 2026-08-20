import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Tokens } from "../../theme/Tokens";
/** Secondary actions folded behind one control, so a toolbar stays readable. */
export const MenuButton = ({ label, iconName = "More", items, disabled }) => (React.createElement(DefaultButton, { text: label, iconProps: { iconName }, disabled: disabled, menuProps: {
        items: items.map((item) => ({
            key: item.key,
            text: item.label,
            iconProps: item.iconName ? { iconName: item.iconName } : undefined,
            disabled: item.disabled,
            onClick: () => item.onClick(),
        })),
    }, styles: { root: { minHeight: Tokens.hitTarget, borderRadius: Tokens.radius.sm } } }));
//# sourceMappingURL=MenuButton.js.map