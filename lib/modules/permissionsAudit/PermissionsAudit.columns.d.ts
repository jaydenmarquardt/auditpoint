import { TableColumn } from "../../components/Components.types";
import { PermissionGrant, PermissionLevel, SiteGroupSummary, UniqueScope } from "../../api/SitePermissions.types";
export declare function groupColumns(onSelect: (group: SiteGroupSummary) => void): TableColumn<SiteGroupSummary>[];
export declare const levelColumns: TableColumn<PermissionLevel>[];
export declare const grantColumns: TableColumn<PermissionGrant>[];
export declare function flagsOf(grant: PermissionGrant): string[];
export declare const scopeColumns: TableColumn<UniqueScope>[];
//# sourceMappingURL=PermissionsAudit.columns.d.ts.map