import { SiteUser } from "../../api/Users.types";
import { UsersAuditConfig, UsersAuditData, UsersAuditView } from "./UsersAudit.types";
export declare function kindLabel(kind: SiteUser["kind"]): string;
export declare function isDormant(user: SiteUser, recentDays: number): boolean;
export declare function groupsByLogin(groups: {
    title: string;
    members: {
        loginName: string;
    }[];
}[]): Map<string, string[]>;
export declare function buildView(data: Partial<UsersAuditData> | undefined, config: UsersAuditConfig): UsersAuditView;
//# sourceMappingURL=UsersAudit.logic.d.ts.map