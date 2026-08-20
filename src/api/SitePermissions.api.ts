import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { SiteList } from "@/api/Lists.types";
import {
  BrokenItem,
  GroupMember,
  PermissionGrant,
  PermissionLevel,
  PrincipalKind,
  SiteGroupSummary,
} from "@/api/SitePermissions.types";
import { toErrorMessage } from "@/utils/Guard.util";

const ASSIGNMENT_SELECT = [
  "PrincipalId",
  "Member/Id",
  "Member/Title",
  "Member/LoginName",
  "Member/PrincipalType",
  "RoleDefinitionBindings/Name",
  "RoleDefinitionBindings/Hidden",
];

interface AssignmentRow {
  PrincipalId: number;
  Member?: { Id?: number; Title?: string; LoginName?: string; PrincipalType?: number };
  RoleDefinitionBindings?: { Name: string; Hidden?: boolean }[];
}

interface ItemPermissionRow {
  Id: number;
  Title?: string;
  FileRef?: string;
  HasUniqueRoleAssignments?: boolean;
}

interface GroupRow {
  Id: number;
  Title: string;
  Description?: string;
  OwnerTitle?: string;
  LoginName?: string;
  AllowMembersEditMembership?: boolean;
  OnlyAllowMembersViewMembership?: boolean;
}

interface UserRow {
  Title: string;
  LoginName: string;
  Email?: string;
  PrincipalType?: number;
  IsSiteAdmin?: boolean;
}

export function SitePermissions(webUrl?: string): {
  levels(): Promise<PermissionLevel[]>;
  groups(withMembers: boolean): Promise<SiteGroupSummary[]>;
  webGrants(siteTitle: string): Promise<PermissionGrant[]>;
  listGrants(list: SiteList): Promise<PermissionGrant[]>;
  itemsWithUniquePermissions(
    list: SiteList,
    maxItems: number
  ): Promise<{ checked: number; unique: number; items: BrokenItem[] }>;
} {
  const site = webUrl ?? "";

  return {
    async levels(): Promise<PermissionLevel[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.roleDefinitions.select(
              "Id",
              "Name",
              "Description",
              "Order",
              "RoleTypeKind",
              "Hidden",
              "BasePermissions"
            )(),
        { label: "Permissions.levels" }
      )) as RoleDefinitionRow[];

      return rows.map((row) => ({
        id: row.Id,
        name: row.Name,
        description: row.Description ?? "",
        roleTypeKind: Number(row.RoleTypeKind ?? 0),
        hidden: Boolean(row.Hidden),
        order: Number(row.Order ?? 0),
        isCustom: Number(row.RoleTypeKind ?? 0) === 0,
        permissions: decodePermissions(row.BasePermissions),
      }));
    },

    async groups(withMembers: boolean): Promise<SiteGroupSummary[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.siteGroups.select(
              "Id",
              "Title",
              "Description",
              "OwnerTitle",
              "LoginName",
              "AllowMembersEditMembership",
              "OnlyAllowMembersViewMembership"
            )(),
        { label: "Permissions.groups" }
      )) as GroupRow[];

      const groups: SiteGroupSummary[] = rows.map((row) => ({
        siteUrl: site,
        id: row.Id,
        title: row.Title,
        description: row.Description ?? "",
        ownerTitle: row.OwnerTitle ?? "",
        loginName: row.LoginName ?? "",
        allowMembersEditMembership: Boolean(row.AllowMembersEditMembership),
        onlyAllowMembersViewMembership: Boolean(row.OnlyAllowMembersViewMembership),
        isSharingLink: /^sharinglinks\./i.test(row.Title ?? ""),
        memberCount: 0,
        members: [],
      }));

      if (!withMembers) return groups;

      for (const group of groups) {
        try {
          const users = (await throttled(
            () =>
              getSp(webUrl)
                .web.siteGroups.getById(group.id)
                .users.select("Title", "LoginName", "Email", "PrincipalType", "IsSiteAdmin")(),
            { label: "Permissions.groupUsers" }
          )) as UserRow[];

          group.members = users.map(toMember);
          group.memberCount = users.length;
        } catch (error) {
          group.error = toErrorMessage(error);
        }
      }

      return groups;
    },

    async webGrants(siteTitle: string): Promise<PermissionGrant[]> {
      const rows = (await throttled(
        () => getSp(webUrl).web.roleAssignments.select(...ASSIGNMENT_SELECT).expand("Member", "RoleDefinitionBindings")(),
        { label: "Permissions.webGrants" }
      )) as AssignmentRow[];

      return rows.map((row) => toGrant(row, site, "web", siteTitle, site));
    },

    async listGrants(list: SiteList): Promise<PermissionGrant[]> {
      const rows = (await throttled(
        () =>
          getSp(webUrl)
            .web.lists.getById(list.id)
            .roleAssignments.select(...ASSIGNMENT_SELECT)
            .expand("Member", "RoleDefinitionBindings")(),
        { label: "Permissions.listGrants" }
      )) as AssignmentRow[];

      return rows.map((row) => toGrant(row, site, "list", list.title, list.serverRelativeUrl));
    },

    /** Pages the list rather than taking one page, so a whole list can be checked. */
    async itemsWithUniquePermissions(
      list: SiteList,
      maxItems: number
    ): Promise<{ checked: number; unique: number; items: BrokenItem[] }> {
      const items: BrokenItem[] = [];
      let checked = 0;
      let unique = 0;

      const query = getSp(webUrl)
        .web.lists.getById(list.id)
        .items.select("Id", "Title", "FileRef", "HasUniqueRoleAssignments")
        .top(Math.min(2000, Math.max(1, maxItems)));

      for await (const page of query) {
        for (const row of page as ItemPermissionRow[]) {
          if (checked >= maxItems) {
            return { checked, unique, items };
          }

          checked = checked + 1;
          if (!row.HasUniqueRoleAssignments) continue;

          unique = unique + 1;
          if (items.length < 500) {
            items.push({
              siteUrl: site,
              listTitle: list.title,
              itemId: row.Id,
              title: row.Title || row.FileRef?.split("/").pop() || String(row.Id),
              url: row.FileRef ?? "",
            });
          }
        }
      }

      return { checked, unique, items };
    },
  };
}

function toGrant(
  row: AssignmentRow,
  siteUrl: string,
  scope: "web" | "list",
  scopeTitle: string,
  scopeUrl: string
): PermissionGrant {
  const loginName = row.Member?.LoginName ?? "";
  const title = row.Member?.Title ?? "";

  return {
    siteUrl,
    scope,
    scopeTitle,
    scopeUrl,
    principalId: row.PrincipalId,
    principalTitle: title,
    loginName,
    kind: kindOf(row.Member?.PrincipalType),
    isExternal: isExternal(loginName),
    isEveryone: isEveryone(loginName, title),
    isSharingLink: /^sharinglinks\./i.test(title),
    roles: (row.RoleDefinitionBindings ?? []).filter((role) => !role.Hidden).map((role) => role.Name),
  };
}

function toMember(row: UserRow): GroupMember {
  return {
    title: row.Title,
    loginName: row.LoginName,
    email: row.Email ?? "",
    kind: kindOf(row.PrincipalType),
    isExternal: isExternal(row.LoginName),
    isSiteAdmin: Boolean(row.IsSiteAdmin),
  };
}

interface RoleDefinitionRow {
  Id: number;
  Name: string;
  Description?: string;
  Order?: number;
  RoleTypeKind?: number;
  Hidden?: boolean;
  BasePermissions?: { High: string | number; Low: string | number };
}

/** SharePoint rights, by bit position in the permission mask. */
const RIGHTS: { bit: number; name: string }[] = [
  { bit: 1, name: "View list items" },
  { bit: 2, name: "Add list items" },
  { bit: 3, name: "Edit list items" },
  { bit: 4, name: "Delete list items" },
  { bit: 5, name: "Approve items" },
  { bit: 6, name: "Open items" },
  { bit: 7, name: "View versions" },
  { bit: 8, name: "Delete versions" },
  { bit: 9, name: "Override check out" },
  { bit: 10, name: "Manage personal views" },
  { bit: 12, name: "Manage lists" },
  { bit: 13, name: "View form pages" },
  { bit: 14, name: "Anonymous search access list" },
  { bit: 17, name: "Open web" },
  { bit: 18, name: "View pages" },
  { bit: 19, name: "Add and customise pages" },
  { bit: 20, name: "Apply theme and border" },
  { bit: 21, name: "Apply style sheets" },
  { bit: 22, name: "View usage data" },
  { bit: 23, name: "Create site collection" },
  { bit: 24, name: "Manage subwebs" },
  { bit: 25, name: "Create groups" },
  { bit: 26, name: "Manage permissions" },
  { bit: 27, name: "Browse directories" },
  { bit: 28, name: "Browse user info" },
  { bit: 29, name: "Add and remove personal web parts" },
  { bit: 30, name: "Use remote interfaces" },
  { bit: 31, name: "Use client integration" },
  { bit: 32, name: "Open" },
  { bit: 33, name: "Edit personal user information" },
  { bit: 34, name: "Manage alerts" },
  { bit: 35, name: "Create alerts" },
  { bit: 37, name: "Enumerate permissions" },
];

function decodePermissions(mask: RoleDefinitionRow["BasePermissions"]): string[] {
  if (!mask) return [];

  const high = Number(mask.High ?? 0);
  const low = Number(mask.Low ?? 0);

  if ((high & 32767) === 32767 && low === 65535) return ["Full control"];

  return RIGHTS.filter((right) => {
    const bit = 1 << ((right.bit - 1) % 32);
    return right.bit <= 32 ? (low & bit) !== 0 : (high & bit) !== 0;
  }).map((right) => right.name);
}

function kindOf(principalType: number | undefined): PrincipalKind {
  if (principalType === 1) return "user";
  if (principalType === 2) return "distributionList";
  if (principalType === 4) return "securityGroup";
  if (principalType === 8) return "sharePointGroup";
  return "other";
}

function isExternal(loginName: string): boolean {
  return /#ext#|urn:spo:guest/i.test(loginName);
}

function isEveryone(loginName: string, title: string): boolean {
  return /spo-grid-all-users|c:0\(\.s\|true|everyone/i.test(`${loginName} ${title}`);
}
