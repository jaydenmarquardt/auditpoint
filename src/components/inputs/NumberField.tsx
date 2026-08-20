import * as React from "react";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Position } from "@fluentui/react/lib/Positioning";
import { NumberFieldProps } from "@/components/Components.types";

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled,
  suffix,
}) => {
  const clamp = (next: number): number => Math.min(max, Math.max(min, next));

  return (
    <SpinButton
      label={label}
      labelPosition={Position.top}
      value={suffix ? `${value}${suffix}` : String(value)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValidate={(next) => {
        const parsed = Number.parseFloat(next.replace(/[^\d.-]/g, ""));
        const safe = Number.isNaN(parsed) ? min : clamp(parsed);
        onChange(safe);
        return String(safe);
      }}
      onIncrement={(next) => {
        const safe = clamp(Number.parseFloat(next.replace(/[^\d.-]/g, "")) + step);
        onChange(safe);
        return String(safe);
      }}
      onDecrement={(next) => {
        const safe = clamp(Number.parseFloat(next.replace(/[^\d.-]/g, "")) - step);
        onChange(safe);
        return String(safe);
      }}
    />
  );
};
