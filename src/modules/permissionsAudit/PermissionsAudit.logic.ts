import { PermissionGrant, PrincipalKind } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import {
  PermissionsAuditData,
  PermissionsAuditView,
  PermissionsTotals,
} from "@/modules/permissionsAudit/PermissionsAudit.types";

export function kindLabel(kind: PrincipalKind): string {
  return PermissionsAuditContent.kinds[kind === "other" ? "other" : kind];
}

export function hasFullControl(grant: PermissionGrant): boolean {
  return grant.roles.some((role) => /full control/i.test(role));
}

export function buildView(data: Partial<PermissionsAuditData> | undefined): PermissionsAuditView {
  const groups = data?.groups ?? [];
  const levels = data?.levels ?? [];
  const grants = data?.grants ?? [];
  const scopes = data?.scopes ?? [];

  const directGrants = grants.filter((grant) => grant.kind === "user");
  const externals = new Set(
    [
      ...grants.filter((grant) => grant.isExternal).map((grant) => grant.loginName),
      ...groups.flatMap((group) => group.members.filter((member) => member.isExternal).map((member) => member.loginName)),
    ].filter(Boolean)
  );

  const totals: PermissionsTotals = {
    groups: groups.length,
    members: groups.reduce((sum, group) => sum + group.memberCount, 0),
    emptyGroups: groups.filter((group) => !group.isSharingLink && group.memberCount === 0).length,
    levels: levels.length,
    customLevels: levels.filter((level) => level.isCustom).length,
    grants: grants.length,
    directUserGrants: directGrants.length,
    groupGrants: grants.filter((grant) => grant.kind !== "user").length,
    externalPrincipals: externals.size,
    everyoneGrants: grants.filter((grant) => grant.isEveryone).length,
    sharingLinks: groups.filter((group) => group.isSharingLink).length,
    lists: data?.listCount ?? 0,
    uniqueLists: scopes.length,
    itemsChecked: scopes.reduce((sum, scope) => sum + (scope.itemsChecked ?? 0), 0),
    itemBreaks: scopes.reduce((sum, scope) => sum + (scope.itemsWithUniquePermissions ?? 0), 0),
    fullControlGrants: grants.filter(hasFullControl).length,
  };

  return {
    totals,
    grantsByKind: countBy(grants.map((grant) => kindLabel(grant.kind))),
    grantsByLevel: countBy(grants.flatMap((grant) => grant.roles)),
    membersByGroup: groups
      .filter((group) => !group.isSharingLink)
      .map((group) => ({ label: group.title, value: group.memberCount }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12),
    inheritanceSplit: [
      { label: "Inherits site permissions", value: Math.max(0, totals.lists - totals.uniqueLists) },
      { label: "Unique permissions", value: totals.uniqueLists },
    ],
    directGrants,
    riskyGrants: grants.filter((grant) => grant.isEveryone || grant.isExternal || hasFullControl(grant)),
  };
}

function countBy(values: string[]): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
