import * as React from "react";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react/lib/ChoiceGroup";
import { RadioGroupProps } from "@/components/Components.types";

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedKey,
  onChange,
  disabled,
  inline,
}) => (
  <ChoiceGroup
    label={label}
    selectedKey={selectedKey}
    disabled={disabled}
    options={options.map((option) => ({ key: option.key, text: option.text, disabled: option.disabled }))}
    styles={inline ? { flexContainer: { display: "flex", gap: 16 } } : undefined}
    onChange={(_event, option?: IChoiceGroupOption) => {
      if (option) onChange(String(option.key));
    }}
  />
);
