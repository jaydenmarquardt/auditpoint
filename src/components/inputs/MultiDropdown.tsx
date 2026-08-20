import * as React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { MultiDropdownProps } from "@/components/Components.types";

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  label,
  options,
  selectedKeys,
  onChange,
  placeholder,
  disabled,
}) => (
  <Dropdown
    multiSelect
    label={label}
    options={options as IDropdownOption[]}
    selectedKeys={selectedKeys}
    placeholder={placeholder}
    disabled={disabled}
    onChange={(_event, option) => {
      if (!option) return;
      const key = String(option.key);
      onChange(option.selected ? [...selectedKeys, key] : selectedKeys.filter((value) => value !== key));
    }}
  />
);
