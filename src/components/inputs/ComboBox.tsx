import * as React from "react";
import { ComboBox as FluentComboBox, IComboBoxOption } from "@fluentui/react/lib/ComboBox";
import { ComboBoxProps } from "@/components/Components.types";

export const ComboBox: React.FC<ComboBoxProps> = ({
  label,
  options,
  selectedKey,
  onChange,
  allowFreeform = true,
  placeholder,
  disabled,
  errorMessage,
}) => (
  <FluentComboBox
    label={label}
    options={options as IComboBoxOption[]}
    selectedKey={selectedKey ?? null}
    allowFreeform={allowFreeform}
    autoComplete="on"
    useComboBoxAsMenuWidth
    placeholder={placeholder}
    disabled={disabled}
    errorMessage={errorMessage}
    onChange={(_event, option, _index, value) => {
      if (option) onChange(String(option.key));
      else if (allowFreeform && value) onChange(value);
    }}
  />
);
