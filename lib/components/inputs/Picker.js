import * as React from "react";
import { TagPicker } from "@fluentui/react/lib/Pickers";
import { Label } from "@fluentui/react/lib/Label";
import { Theme } from "../../theme/Theme.api";
/** Single value picker for long option lists: type to filter, one selection. */
export const Picker = ({ label, options, selectedKey, onChange, placeholder, disabled, }) => {
    const tags = options.map((option) => ({ key: option.key, name: option.text }));
    const selected = tags.filter((tag) => tag.key === selectedKey);
    const inputId = `picker-${label.replace(/\s+/g, "-").toLowerCase()}`;
    return (React.createElement("div", { style: { minWidth: 0 } },
        React.createElement(Label, { htmlFor: inputId, styles: { root: { padding: "5px 0" } } }, label),
        React.createElement(TagPicker, { inputProps: { id: inputId, placeholder: placeholder !== null && placeholder !== void 0 ? placeholder : "All", disabled }, disabled: disabled, selectedItems: selected, itemLimit: 1, removeButtonAriaLabel: "Clear", onResolveSuggestions: (filter) => tags.filter((tag) => tag.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1).slice(0, 30), onEmptyResolveSuggestions: () => tags.slice(0, 30), onChange: (items) => onChange(items && items.length > 0 ? String(items[0].key) : ""), pickerSuggestionsProps: { suggestionsHeaderText: label, noResultsFoundText: "No matches" }, styles: { root: { minWidth: 220 }, text: { minHeight: 32, borderRadius: Theme.tokens.radius.sm } } })));
};
//# sourceMappingURL=Picker.js.map