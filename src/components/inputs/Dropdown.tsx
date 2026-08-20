import * as React from "react";
import { Dropdown as FluentDropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { DropdownProps } from "@/components/Components.types";



export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedKey,
  onChange,
  placeholder,
  errorMessage,
  required,
  disabled,
}) => (
  <FluentDropdown
    label={label}
    options={options as IDropdownOption[]}
    selectedKey={selectedKey ?? null}
    onChange={(_event, option) => {
      if (option) onChange(String(option.key));
    }}
    placeholder={placeholder}
    errorMessage={errorMessage}
    required={required}
    disabled={disabled}
  />
);
