import * as React from "react";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { DatePickerFieldProps } from "@/components/Components.types";

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select a date",
  disabled,
  minDate,
  maxDate,
}) => (
  <DatePicker
    label={label}
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    minDate={minDate}
    maxDate={maxDate}
    ariaLabel={label}
    allowTextInput
    onSelectDate={(next) => onChange(next ?? undefined)}
  />
);
