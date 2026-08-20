import * as React from "react";
import { SearchBox as FluentSearchBox } from "@fluentui/react/lib/SearchBox";
import { Tokens } from "../../theme/Tokens";
export const SearchBox = ({ label, value, onChange, onSearch, placeholder, disabled, width = 280, }) => (React.createElement(FluentSearchBox, { ariaLabel: label, value: value, placeholder: placeholder !== null && placeholder !== void 0 ? placeholder : label, disabled: disabled, onChange: (_event, next) => onChange(next !== null && next !== void 0 ? next : ""), onSearch: onSearch, onClear: () => onChange(""), styles: { root: { width, height: 32, borderRadius: Tokens.radius.sm } } }));
//# sourceMappingURL=SearchBox.js.map