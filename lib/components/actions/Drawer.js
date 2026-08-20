import * as React from "react";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
const TYPES = {
    small: PanelType.smallFixedFar,
    medium: PanelType.medium,
    large: PanelType.large,
};
export const Drawer = ({ open, title, onDismiss, width = "medium", footer, children, }) => (React.createElement(Panel, { isOpen: open, headerText: title, onDismiss: onDismiss, type: TYPES[width], closeButtonAriaLabel: "Close panel", isFooterAtBottom: true, onRenderFooterContent: footer ? () => React.createElement("div", null, footer) : undefined }, children));
//# sourceMappingURL=Drawer.js.map