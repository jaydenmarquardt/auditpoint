import { SiteList } from "./Lists.types";
import { BrokenItem, PermissionGrant, PermissionLevel, SiteGroupSummary } from "./SitePermissions.types";
export declare function SitePermissions(webUrl?: string): {
    levels(): Promise<PermissionLevel[]>;
    groups(withMembers: boolean): Promise<SiteGroupSummary[]>;
    webGrants(siteTitle: string): Promise<PermissionGrant[]>;
    listGrants(list: SiteList): Promise<PermissionGrant[]>;
    itemsWithUniquePermissions(list: SiteList, maxItems: number): Promise<{
        checked: number;
        unique: number;
        items: BrokenItem[];
    }>;
};
//# sourceMappingURL=SitePermissions.api.d.ts.map