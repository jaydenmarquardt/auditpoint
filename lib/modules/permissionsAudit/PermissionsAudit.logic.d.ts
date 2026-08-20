import { PermissionGrant, PrincipalKind } from "../../api/SitePermissions.types";
import { PermissionsAuditData, PermissionsAuditView } from "./PermissionsAudit.types";
export declare function kindLabel(kind: PrincipalKind): string;
export declare function hasFullControl(grant: PermissionGrant): boolean;
export declare function buildView(data: Partial<PermissionsAuditData> | undefined): PermissionsAuditView;
//# sourceMappingURL=PermissionsAudit.logic.d.ts.map