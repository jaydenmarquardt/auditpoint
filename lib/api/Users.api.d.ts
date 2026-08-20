import { SiteUser, UserProfileSummary } from "./Users.types";
export declare function SiteUsers(webUrl?: string): {
    all(): Promise<SiteUser[]>;
    withInfoList(users: SiteUser[]): Promise<SiteUser[]>;
    profile(loginName: string): Promise<UserProfileSummary>;
};
//# sourceMappingURL=Users.api.d.ts.map