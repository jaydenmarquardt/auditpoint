import * as React from "react";
import { Toggle as FluentToggle } from "@fluentui/react/lib/Toggle";
import { ToggleProps } from "@/components/Components.types";

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  onText = "On",
  offText = "Off",
  inlineLabel,
  disabled,
}) => (
  <FluentToggle
    label={label}
    checked={checked}
    onText={onText}
    offText={offText}
    inlineLabel={inlineLabel}
    disabled={disabled}
    onChange={(_event, next) => onChange(Boolean(next))}
  />
);
