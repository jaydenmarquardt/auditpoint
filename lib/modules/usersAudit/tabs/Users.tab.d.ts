import * as React from "react";
import { SiteUser } from "../../../api/Users.types";
import { SiteGroupSummary } from "../../../api/SitePermissions.types";
export interface UsersTabProps {
    users: SiteUser[];
    groups: SiteGroupSummary[];
    recentDays: number;
    onSelect: (user: SiteUser) => void;
}
export declare const UsersTab: React.FC<UsersTabProps>;
//# sourceMappingURL=Users.tab.d.ts.map