import * as React from "react";
import { Spinner as FluentSpinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
const SIZES = {
    small: SpinnerSize.small,
    medium: SpinnerSize.medium,
    large: SpinnerSize.large,
};
export const Spinner = ({ label, size = "medium" }) => (React.createElement(FluentSpinner, { size: SIZES[size], label: label, ariaLive: "polite", labelPosition: "right" }));
//# sourceMappingURL=Spinner.js.map