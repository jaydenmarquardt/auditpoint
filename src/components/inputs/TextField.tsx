import * as React from "react";
import { TextField as FluentTextField } from "@fluentui/react/lib/TextField";
import { TextFieldProps } from "@/components/Components.types";

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  description,
  errorMessage,
  required,
  disabled,
  readOnly,
  maxLength,
  iconName,
}) => (
  <FluentTextField
    label={label}
    value={value}
    onChange={(_event, next) => onChange(next ?? "")}
    placeholder={placeholder}
    description={description}
    errorMessage={errorMessage}
    required={required}
    disabled={disabled}
    readOnly={readOnly}
    maxLength={maxLength}
    iconProps={iconName ? { iconName } : undefined}
  />
);
