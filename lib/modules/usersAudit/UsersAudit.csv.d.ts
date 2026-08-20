import { SiteGroupSummary } from "../../api/SitePermissions.types";
import { SiteUser, UserProfileSummary } from "../../api/Users.types";
import { UsersAuditData } from "./UsersAudit.types";
export declare function userRow(user: SiteUser): Record<string, unknown>;
export declare function groupRow(group: SiteGroupSummary): Record<string, unknown>;
export declare function profileRow(profile: UserProfileSummary): Record<string, unknown>;
export declare function exportUsers(data: Partial<UsersAuditData> | undefined): void;
export declare function exportGroups(data: Partial<UsersAuditData> | undefined): void;
export declare function exportProfiles(data: Partial<UsersAuditData> | undefined): void;
//# sourceMappingURL=UsersAudit.csv.d.ts.map