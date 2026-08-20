import * as React from "react";
import { ComboBox as FluentComboBox } from "@fluentui/react/lib/ComboBox";
export const ComboBox = ({ label, options, selectedKey, onChange, allowFreeform = true, placeholder, disabled, errorMessage, }) => (React.createElement(FluentComboBox, { label: label, options: options, selectedKey: selectedKey !== null && selectedKey !== void 0 ? selectedKey : null, allowFreeform: allowFreeform, autoComplete: "on", useComboBoxAsMenuWidth: true, placeholder: placeholder, disabled: disabled, errorMessage: errorMessage, onChange: (_event, option, _index, value) => {
        if (option)
            onChange(String(option.key));
        else if (allowFreeform && value)
            onChange(value);
    } }));
//# sourceMappingURL=ComboBox.js.map