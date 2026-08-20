import * as React from "react";
import { AggregatedLink } from "./LinkAudit.types";
export interface LinkDialogProps {
    link?: AggregatedLink;
    origin: string;
    onDismiss: () => void;
}
export declare const LinkDialog: React.FC<LinkDialogProps>;
//# sourceMappingURL=Link.dialog.d.ts.map