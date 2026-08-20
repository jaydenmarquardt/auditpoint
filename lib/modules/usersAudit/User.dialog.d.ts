import * as React from "react";
import { SiteUser, UserProfileSummary } from "../../api/Users.types";
export interface UserDialogProps {
    user?: SiteUser;
    profiles: UserProfileSummary[];
    groups: string[];
    onLoaded: (profile: UserProfileSummary) => void;
    onDismiss: () => void;
}
export declare const UserDialog: React.FC<UserDialogProps>;
//# sourceMappingURL=User.dialog.d.ts.map