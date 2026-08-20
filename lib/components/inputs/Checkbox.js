import * as React from "react";
import { Checkbox as FluentCheckbox } from "@fluentui/react/lib/Checkbox";
export const Checkbox = ({ label, checked, onChange, disabled, indeterminate, }) => (React.createElement(FluentCheckbox, { label: label, checked: checked, indeterminate: indeterminate, disabled: disabled, onChange: (_event, next) => onChange(Boolean(next)) }));
//# sourceMappingURL=Checkbox.js.map