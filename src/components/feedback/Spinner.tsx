import * as React from "react";
import { Spinner as FluentSpinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { SpinnerProps } from "@/components/Components.types";

const SIZES = {
  small: SpinnerSize.small,
  medium: SpinnerSize.medium,
  large: SpinnerSize.large,
};

export const Spinner: React.FC<SpinnerProps> = ({ label, size = "medium" }) => (
  <FluentSpinner size={SIZES[size]} label={label} ariaLive="polite" labelPosition="right" />
);
