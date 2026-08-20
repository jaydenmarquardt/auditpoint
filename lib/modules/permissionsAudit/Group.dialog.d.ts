import * as React from "react";
import { PermissionGrant, SiteGroupSummary } from "../../api/SitePermissions.types";
export interface GroupDialogProps {
    group?: SiteGroupSummary;
    grants: PermissionGrant[];
    onDismiss: () => void;
}
export declare const GroupDialog: React.FC<GroupDialogProps>;
//# sourceMappingURL=Group.dialog.d.ts.map