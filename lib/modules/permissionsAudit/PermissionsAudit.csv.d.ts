import { BrokenItem, PermissionGrant, SiteGroupSummary } from "../../api/SitePermissions.types";
import { PermissionsAuditData } from "./PermissionsAudit.types";
export declare function grantRow(grant: PermissionGrant): Record<string, unknown>;
export declare function groupRow(group: SiteGroupSummary): Record<string, unknown>;
export declare function brokenItemRow(item: BrokenItem): Record<string, unknown>;
export declare function exportPermissionsAudit(data: Partial<PermissionsAuditData> | undefined): void;
export declare function exportGroups(data: Partial<PermissionsAuditData> | undefined): void;
export declare function exportBrokenItems(data: Partial<PermissionsAuditData> | undefined): void;
//# sourceMappingURL=PermissionsAudit.csv.d.ts.map