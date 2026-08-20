import { AccessProfile, CurrentUser } from "./Sp.types";
export declare function Permissions(webUrl?: string): {
    currentUser(): Promise<CurrentUser>;
    accessProfile(): Promise<AccessProfile>;
    hasManageWeb(): boolean;
};
//# sourceMappingURL=Permissions.api.d.ts.map