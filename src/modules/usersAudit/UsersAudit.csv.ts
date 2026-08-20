import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { SiteUser, UserProfileSummary } from "@/api/Users.types";
import { UsersAuditData } from "@/modules/usersAudit/UsersAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function userRow(user: SiteUser): Record<string, unknown> {
  return {
    site: user.siteUrl,
    title: user.title,
    loginName: user.loginName,
    email: user.email,
    kind: user.kind,
    siteAdmin: user.isSiteAdmin,
    external: user.isExternal,
    system: user.isSystem,
    firstSeen: user.createdIso ?? "",
    recordChanged: user.modifiedIso ?? "",
  };
}

export function groupRow(group: SiteGroupSummary): Record<string, unknown> {
  return {
    site: group.siteUrl,
    group: group.title,
    owner: group.ownerTitle,
    members: group.memberCount,
    memberLogins: group.members.map((member) => member.loginName).join("|"),
  };
}

export function profileRow(profile: UserProfileSummary): Record<string, unknown> {
  return {
    loginName: profile.loginName,
    displayName: profile.displayName,
    email: profile.email,
    department: profile.department,
    jobTitle: profile.jobTitle,
    office: profile.office,
    hasPicture: profile.hasPicture,
    propertyCount: profile.propertyCount,
    error: profile.error ?? "",
  };
}

export function exportUsers(data: Partial<UsersAuditData> | undefined): void {
  downloadCsv("users-audit", (data?.users ?? []).map(userRow));
}

export function exportGroups(data: Partial<UsersAuditData> | undefined): void {
  downloadCsv("users-groups", (data?.groups ?? []).map(groupRow));
}

export function exportProfiles(data: Partial<UsersAuditData> | undefined): void {
  downloadCsv("users-profiles", (data?.profiles ?? []).map(profileRow));
}
