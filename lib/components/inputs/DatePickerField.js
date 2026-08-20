import * as React from "react";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
export const DatePickerField = ({ label, value, onChange, placeholder = "Select a date", disabled, minDate, maxDate, }) => (React.createElement(DatePicker, { label: label, value: value, placeholder: placeholder, disabled: disabled, minDate: minDate, maxDate: maxDate, ariaLabel: label, allowTextInput: true, onSelectDate: (next) => onChange(next !== null && next !== void 0 ? next : undefined) }));
//# sourceMappingURL=DatePickerField.js.map