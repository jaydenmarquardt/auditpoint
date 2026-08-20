import * as React from "react";
import { PermissionGrant, PermissionLevel } from "../../api/SitePermissions.types";
export interface LevelDialogProps {
    level?: PermissionLevel;
    grants: PermissionGrant[];
    onDismiss: () => void;
}
export declare const LevelDialog: React.FC<LevelDialogProps>;
//# sourceMappingURL=Level.dialog.d.ts.map