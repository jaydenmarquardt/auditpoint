import * as React from "react";
import { Spinner } from "../feedback/Spinner";
import { StatesContent } from "./States.content";
import { Tokens } from "../../theme/Tokens";
export const LoadingState = ({ label, full = true }) => (React.createElement("div", { role: "status", "aria-live": "polite", style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: full ? 240 : undefined,
        padding: Tokens.space.lg,
    } },
    React.createElement(Spinner, { label: label !== null && label !== void 0 ? label : StatesContent.loading.label })));
//# sourceMappingURL=Loading.state.js.map