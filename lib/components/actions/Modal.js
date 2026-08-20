import * as React from "react";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react/lib/Dialog";
const WIDTHS = { small: 420, medium: 560, large: 760 };
export const Modal = ({ open, title, description, onDismiss, footer, children, width = "medium", }) => (React.createElement(Dialog, { hidden: !open, onDismiss: onDismiss, minWidth: WIDTHS[width], maxWidth: WIDTHS[width], dialogContentProps: { type: DialogType.normal, title, subText: description }, modalProps: { isBlocking: true } },
    children,
    footer ? React.createElement(DialogFooter, null, footer) : undefined));
//# sourceMappingURL=Modal.js.map