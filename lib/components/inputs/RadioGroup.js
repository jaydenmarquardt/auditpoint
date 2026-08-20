import * as React from "react";
import { ChoiceGroup } from "@fluentui/react/lib/ChoiceGroup";
export const RadioGroup = ({ label, options, selectedKey, onChange, disabled, inline, }) => (React.createElement(ChoiceGroup, { label: label, selectedKey: selectedKey, disabled: disabled, options: options.map((option) => ({ key: option.key, text: option.text, disabled: option.disabled })), styles: inline ? { flexContainer: { display: "flex", gap: 16 } } : undefined, onChange: (_event, option) => {
        if (option)
            onChange(String(option.key));
    } }));
//# sourceMappingURL=RadioGroup.js.map