import * as React from "react";
import { TagPicker, ITag } from "@fluentui/react/lib/Pickers";
import { Label } from "@fluentui/react/lib/Label";
import { Theme } from "@/theme/Theme.api";
import { PickerProps } from "@/components/Components.types";

/** Single value picker for long option lists: type to filter, one selection. */
export const Picker: React.FC<PickerProps> = ({
  label,
  options,
  selectedKey,
  onChange,
  placeholder,
  disabled,
}) => {
  const tags: ITag[] = options.map((option) => ({ key: option.key, name: option.text }));
  const selected = tags.filter((tag) => tag.key === selectedKey);
  const inputId = `picker-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div style={{ minWidth: 0 }}>
      <Label htmlFor={inputId} styles={{ root: { padding: "5px 0" } }}>
        {label}
      </Label>

      <TagPicker
        inputProps={{ id: inputId, placeholder: placeholder ?? "All", disabled }}
        disabled={disabled}
        selectedItems={selected}
        itemLimit={1}
        removeButtonAriaLabel="Clear"
        onResolveSuggestions={(filter) =>
          tags.filter((tag) => tag.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1).slice(0, 30)
        }
        onEmptyResolveSuggestions={() => tags.slice(0, 30)}
        onChange={(items) => onChange(items && items.length > 0 ? String(items[0].key) : "")}
        pickerSuggestionsProps={{ suggestionsHeaderText: label, noResultsFoundText: "No matches" }}
        styles={{ root: { minWidth: 220 }, text: { minHeight: 32, borderRadius: Theme.tokens.radius.sm } }}
      />
    </div>
  );
};
