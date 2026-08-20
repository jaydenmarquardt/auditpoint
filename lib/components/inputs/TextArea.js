import * as React from "react";
import { TextField } from "@fluentui/react/lib/TextField";
export const TextArea = ({ label, value, onChange, rows = 4, placeholder, description, errorMessage, required, disabled, resizable = true, }) => (React.createElement(TextField, { multiline: true, rows: rows, resizable: resizable, label: label, value: value, onChange: (_event, next) => onChange(next !== null && next !== void 0 ? next : ""), placeholder: placeholder, description: description, errorMessage: errorMessage, required: required, disabled: disabled }));
//# sourceMappingURL=TextArea.js.map