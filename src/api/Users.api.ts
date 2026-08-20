import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SiteUser, UserKind, UserProfileSummary } from "@/api/Users.types";
import { toErrorMessage } from "@/utils/Guard.util";

const SYSTEM_PATTERN = /app@sharepoint|system account|sharepoint app|c:0\(\.s\|true|spocrawler|_spocrawler/i;

interface UserRow {
  Id: number;
  Title: string;
  LoginName: string;
  Email?: string;
  PrincipalType?: number;
  IsSiteAdmin?: boolean;
}

interface InfoRow {
  Id: number;
  Title?: string;
  Name?: string;
  EMail?: string;
  Created?: string;
  Modified?: string;
}

export function SiteUsers(webUrl?: string): {
  all(): Promise<SiteUser[]>;
  withInfoList(users: SiteUser[]): Promise<SiteUser[]>;
  profile(loginName: string): Promise<UserProfileSummary>;
} {
  const site = webUrl ?? "";

  return {
    async all(): Promise<SiteUser[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.siteUsers.select("Id", "Title", "LoginName", "Email", "PrincipalType", "IsSiteAdmin")(),
        { label: "Users.all" }
      )) as UserRow[];

      return rows.map((row) => ({
        siteUrl: site,
        id: row.Id,
        title: row.Title,
        loginName: row.LoginName,
        email: row.Email ?? "",
        kind: kindOf(row.PrincipalType),
        isSiteAdmin: Boolean(row.IsSiteAdmin),
        isExternal: /#ext#|urn:spo:guest/i.test(row.LoginName ?? ""),
        isSystem: SYSTEM_PATTERN.test(`${row.LoginName} ${row.Title}`),
      }));
    },

    /** The user information list is where the created and modified dates live. */
    async withInfoList(users: SiteUser[]): Promise<SiteUser[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.siteUserInfoList.items.select("Id", "Title", "Name", "EMail", "Created", "Modified")
            .top(5000)(),
        { label: "Users.infoList" }
      )) as InfoRow[];

      const byId = new Map(rows.map((row) => [row.Id, row]));

      return users.map((user) => {
        const info = byId.get(user.id);
        return info
          ? { ...user, createdIso: info.Created, modifiedIso: info.Modified }
          : user;
      });
    },

    async profile(loginName: string): Promise<UserProfileSummary> {
      try {
        const profile = await throttled(() => getSp(webUrl).profiles.getPropertiesFor(loginName), {
          label: "Users.profile",
        });

        const properties = readProperties(profile.UserProfileProperties as unknown);

        return {
          loginName,
          displayName: String(profile.DisplayName ?? ""),
          email: String(profile.Email ?? properties.WorkEmail ?? ""),
          department: properties.Department ?? properties["SPS-Department"] ?? "",
          jobTitle: properties.Title ?? properties["SPS-JobTitle"] ?? "",
          office: properties.Office ?? properties["SPS-Location"] ?? "",
          hasPicture: Boolean(profile.PictureUrl),
          propertyCount: Object.keys(properties).filter((key) => properties[key]).length,
        };
      } catch (error) {
        return {
          loginName,
          displayName: "",
          email: "",
          department: "",
          jobTitle: "",
          office: "",
          hasPicture: false,
          propertyCount: 0,
          error: toErrorMessage(error),
        };
      }
    },
  };
}

function readProperties(raw: unknown): Record<string, string> {
  const entries = (raw as { Key?: string; Value?: string }[] | undefined) ?? [];
  const properties: Record<string, string> = {};

  entries.forEach((entry) => {
    if (entry.Key) properties[entry.Key] = String(entry.Value ?? "");
  });

  return properties;
}

function kindOf(principalType: number | undefined): UserKind {
  if (principalType === 1) return "user";
  if (principalType === 4) return "securityGroup";
  if (principalType === 8) return "sharePointGroup";
  return "other";
}
