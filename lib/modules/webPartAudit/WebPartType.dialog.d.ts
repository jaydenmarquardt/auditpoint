import * as React from "react";
import { WebPartInstance } from "../../api/WebParts.types";
import { WebPartTypeSummary } from "./WebPartAudit.types";
export interface WebPartTypeDialogProps {
    type?: WebPartTypeSummary;
    instances: WebPartInstance[];
    onDismiss: () => void;
    onOpenPage: (instance: WebPartInstance) => void;
}
export declare const WebPartTypeDialog: React.FC<WebPartTypeDialogProps>;
//# sourceMappingURL=WebPartType.dialog.d.ts.map