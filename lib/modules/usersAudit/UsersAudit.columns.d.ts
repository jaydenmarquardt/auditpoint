import { TableColumn } from "../../components/Components.types";
import { SiteGroupSummary } from "../../api/SitePermissions.types";
import { SiteUser, UserProfileSummary } from "../../api/Users.types";
export declare function userColumns(recentDays: number, groupsFor: (user: SiteUser) => string[]): TableColumn<SiteUser>[];
export declare function userFlags(user: SiteUser, recentDays: number): string[];
export declare function groupSettingsUrl(group: SiteGroupSummary): string;
export declare const groupColumns: TableColumn<SiteGroupSummary>[];
export declare const profileColumns: TableColumn<UserProfileSummary>[];
//# sourceMappingURL=UsersAudit.columns.d.ts.map