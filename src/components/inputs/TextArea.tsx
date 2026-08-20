import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import { TextAreaProps } from "@/components/Components.types";

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  description,
  errorMessage,
  required,
  disabled,
  resizable = true,
}) => (
  <TextField
    multiline
    rows={rows}
    resizable={resizable}
    label={label}
    value={value}
    onChange={(_event, next) => onChange(next ?? "")}
    placeholder={placeholder}
    description={description}
    errorMessage={errorMessage}
    required={required}
    disabled={disabled}
  />
);
