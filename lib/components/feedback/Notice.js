import * as React from "react";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
const TYPES = {
    info: MessageBarType.info,
    success: MessageBarType.success,
    warning: MessageBarType.warning,
    error: MessageBarType.error,
};
export const Notice = ({ tone = "info", message, onDismiss, actions }) => (React.createElement(MessageBar, { messageBarType: TYPES[tone], onDismiss: onDismiss, actions: actions ? React.createElement("div", null, actions) : undefined, isMultiline: false, dismissButtonAriaLabel: "Dismiss message" }, message));
//# sourceMappingURL=Notice.js.map