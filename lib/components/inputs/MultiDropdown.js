import * as React from "react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
export const MultiDropdown = ({ label, options, selectedKeys, onChange, placeholder, disabled, }) => (React.createElement(Dropdown, { multiSelect: true, label: label, options: options, selectedKeys: selectedKeys, placeholder: placeholder, disabled: disabled, onChange: (_event, option) => {
        if (!option)
            return;
        const key = String(option.key);
        onChange(option.selected ? [...selectedKeys, key] : selectedKeys.filter((value) => value !== key));
    } }));
//# sourceMappingURL=MultiDropdown.js.map