import * as React from "react";
import { Dropdown as FluentDropdown } from "@fluentui/react/lib/Dropdown";
export const Dropdown = ({ label, options, selectedKey, onChange, placeholder, errorMessage, required, disabled, }) => (React.createElement(FluentDropdown, { label: label, options: options, selectedKey: selectedKey !== null && selectedKey !== void 0 ? selectedKey : null, onChange: (_event, option) => {
        if (option)
            onChange(String(option.key));
    }, placeholder: placeholder, errorMessage: errorMessage, required: required, disabled: disabled }));
//# sourceMappingURL=Dropdown.js.map