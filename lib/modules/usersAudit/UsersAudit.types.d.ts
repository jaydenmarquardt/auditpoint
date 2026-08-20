import { SiteGroupSummary } from "../../api/SitePermissions.types";
import { SiteUser, UserProfileSummary } from "../../api/Users.types";
export interface UsersAuditConfig {
    months: number;
    includeSystemAccounts: boolean;
    readGroups: boolean;
    readProfiles: boolean;
    profileSample: number;
    recentDays: number;
}
export interface UsersAuditData {
    users: SiteUser[];
    groups: SiteGroupSummary[];
    profiles: UserProfileSummary[];
    scannedSites: string[];
}
export interface UsersTotals {
    users: number;
    people: number;
    securityGroups: number;
    external: number;
    siteAdmins: number;
    system: number;
    addedInWindow: number;
    activeRecently: number;
    dormant: number;
    groups: number;
    groupMembers: number;
    averageGroupSize: number;
    usersWithoutGroup: number;
    profilesRead: number;
    withDepartment: number;
    withJobTitle: number;
    withPicture: number;
}
export interface UsersAuditView {
    totals: UsersTotals;
    addedByMonth: {
        label: string;
        value: number;
    }[];
    activeByMonth: {
        label: string;
        value: number;
    }[];
    usersByKind: {
        label: string;
        value: number;
    }[];
    membersByGroup: {
        label: string;
        value: number;
    }[];
    byDepartment: {
        label: string;
        value: number;
    }[];
    profileCompleteness: {
        label: string;
        value: number;
    }[];
    ungrouped: SiteUser[];
}
//# sourceMappingURL=UsersAudit.types.d.ts.map