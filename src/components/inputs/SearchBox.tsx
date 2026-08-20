import * as React from "react";
import { SearchBox as FluentSearchBox } from "@fluentui/react/lib/SearchBox";
import { Tokens } from "@/theme/Tokens";
import { SearchBoxProps } from "@/components/Components.types";

export const SearchBox: React.FC<SearchBoxProps> = ({
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  disabled,
  width = 280,
}) => (
  <FluentSearchBox
    ariaLabel={label}
    value={value}
    placeholder={placeholder ?? label}
    disabled={disabled}
    onChange={(_event, next) => onChange(next ?? "")}
    onSearch={onSearch}
    onClear={() => onChange("")}
    styles={{ root: { width, height: 32, borderRadius: Tokens.radius.sm } }}
  />
);
