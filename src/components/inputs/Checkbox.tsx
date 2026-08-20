import * as React from "react";
import { Checkbox as FluentCheckbox } from "@fluentui/react/lib/Checkbox";
import { CheckboxProps } from "@/components/Components.types";

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  indeterminate,
}) => (
  <FluentCheckbox
    label={label}
    checked={checked}
    indeterminate={indeterminate}
    disabled={disabled}
    onChange={(_event, next) => onChange(Boolean(next))}
  />
);
