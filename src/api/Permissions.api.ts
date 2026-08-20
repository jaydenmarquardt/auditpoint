import { getSp, getContext } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { AccessProfile, CurrentUser } from "@/api/Sp.types";

const OWNER_GROUP_PATTERN = /owners$/i;
const MANAGE_WEB_MASK = 0x40000000;

export function Permissions(webUrl?: string): {
  currentUser(): Promise<CurrentUser>;
  accessProfile(): Promise<AccessProfile>;
  hasManageWeb(): boolean;
} {
  return {
    async currentUser(): Promise<CurrentUser> {
      const user = await throttled(() => getSp(webUrl).web.currentUser(), { priority: true });

      return {
        id: user.Id,
        title: user.Title,
        email: user.Email,
        loginName: user.LoginName,
        isSiteAdmin: Boolean(user.IsSiteAdmin),
      };
    },

    /** Site collection admin, owners group, or ManageWeb. */
    async accessProfile(): Promise<AccessProfile> {
      const user = await this.currentUser();
      if (user.isSiteAdmin) return { user, isAdmin: true, groups: [] };

      const groups = await throttled(() => getSp(webUrl).web.currentUser.groups(), { priority: true });
      const titles = groups.map((group) => group.Title);

      return {
        user,
        isAdmin: titles.some((title) => OWNER_GROUP_PATTERN.test(title)) || this.hasManageWeb(),
        groups: titles,
      };
    },

    hasManageWeb(): boolean {
      const legacy = getContext().pageContext.legacyPageContext as
        | { webPermMasks?: { High: number; Low: number } }
        | undefined;
      return ((legacy?.webPermMasks?.High ?? 0) & MANAGE_WEB_MASK) !== 0;
    },
  };
}
