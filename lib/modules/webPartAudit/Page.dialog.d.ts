import * as React from "react";
import { WebPartInstance } from "../../api/WebParts.types";
import { WebPartPageSummary } from "./WebPartAudit.types";
export interface PageDialogProps {
    page?: WebPartPageSummary;
    instances: WebPartInstance[];
    onDismiss: () => void;
}
export declare const PageDialog: React.FC<PageDialogProps>;
//# sourceMappingURL=Page.dialog.d.ts.map