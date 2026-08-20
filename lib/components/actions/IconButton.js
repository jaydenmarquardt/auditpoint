import * as React from "react";
import { IconButton as FluentIconButton } from "@fluentui/react/lib/Button";
import { TooltipHost } from "@fluentui/react/lib/Tooltip";
import { Tokens } from "../../theme/Tokens";
export const IconButton = ({ iconName, ariaLabel, onClick, disabled, toggled, tooltip, }) => {
    const button = (React.createElement(FluentIconButton, { iconProps: { iconName }, ariaLabel: ariaLabel, onClick: onClick, disabled: disabled, checked: toggled, "aria-pressed": toggled === undefined ? undefined : toggled, styles: {
            root: {
                width: Tokens.hitTarget,
                height: Tokens.hitTarget,
                borderRadius: Tokens.radius.sm,
                color: Tokens.colour.text,
            },
            rootHovered: { background: Tokens.colour.accentSoft },
            rootChecked: { background: Tokens.colour.accentSoft, color: Tokens.colour.accent },
        } }));
    return tooltip ? React.createElement(TooltipHost, { content: tooltip }, button) : button;
};
//# sourceMappingURL=IconButton.js.map