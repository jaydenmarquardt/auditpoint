import { BrokenItem, PermissionGrant, SiteGroupSummary } from "@/api/SitePermissions.types";
import { flagsOf } from "@/modules/permissionsAudit/PermissionsAudit.columns";
import { PermissionsAuditData } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function grantRow(grant: PermissionGrant): Record<string, unknown> {
  return {
    site: grant.siteUrl,
    scopeType: grant.scope,
    scope: grant.scopeTitle,
    scopeUrl: grant.scopeUrl,
    principal: grant.principalTitle,
    loginName: grant.loginName,
    kind: grant.kind,
    roles: grant.roles.join("|"),
    flags: flagsOf(grant).join("|"),
  };
}

export function groupRow(group: SiteGroupSummary): Record<string, unknown> {
  return {
    site: group.siteUrl,
    group: group.title,
    owner: group.ownerTitle,
    members: group.memberCount,
    membersCanEditMembership: group.allowMembersEditMembership,
    sharingLink: group.isSharingLink,
    memberLogins: group.members.map((member) => member.loginName).join("|"),
  };
}

export function brokenItemRow(item: BrokenItem): Record<string, unknown> {
  return {
    site: item.siteUrl,
    list: item.listTitle,
    itemId: item.itemId,
    title: item.title,
    url: item.url,
  };
}

export function exportPermissionsAudit(data: Partial<PermissionsAuditData> | undefined): void {
  downloadCsv("permissions-grants", (data?.grants ?? []).map(grantRow));
}

export function exportGroups(data: Partial<PermissionsAuditData> | undefined): void {
  downloadCsv("permissions-groups", (data?.groups ?? []).map(groupRow));
}

export function exportBrokenItems(data: Partial<PermissionsAuditData> | undefined): void {
  downloadCsv("permissions-item-breaks", (data?.brokenItems ?? []).map(brokenItemRow));
}
