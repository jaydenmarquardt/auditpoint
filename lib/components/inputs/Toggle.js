import * as React from "react";
import { Toggle as FluentToggle } from "@fluentui/react/lib/Toggle";
export const Toggle = ({ label, checked, onChange, onText = "On", offText = "Off", inlineLabel, disabled, }) => (React.createElement(FluentToggle, { label: label, checked: checked, onText: onText, offText: offText, inlineLabel: inlineLabel, disabled: disabled, onChange: (_event, next) => onChange(Boolean(next)) }));
//# sourceMappingURL=Toggle.js.map