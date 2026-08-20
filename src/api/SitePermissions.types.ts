export type PrincipalKind = "user" | "securityGroup" | "distributionList" | "sharePointGroup" | "other";

export interface PermissionLevel {
  id: number;
  name: string;
  description: string;
  roleTypeKind: number;
  hidden: boolean;
  order: number;
  /** Anything that is not one of the built in role types. */
  isCustom: boolean;
  /** Individual rights the level grants, decoded from the permission mask. */
  permissions: string[];
}

export interface GroupMember {
  title: string;
  loginName: string;
  email: string;
  kind: PrincipalKind;
  isExternal: boolean;
  isSiteAdmin: boolean;
}

export interface SiteGroupSummary {
  siteUrl: string;
  id: number;
  title: string;
  description: string;
  ownerTitle: string;
  loginName: string;
  allowMembersEditMembership: boolean;
  onlyAllowMembersViewMembership: boolean;
  isSharingLink: boolean;
  memberCount: number;
  members: GroupMember[];
  error?: string;
}

export interface PermissionGrant {
  siteUrl: string;
  scope: "web" | "list";
  scopeTitle: string;
  scopeUrl: string;
  principalId: number;
  principalTitle: string;
  loginName: string;
  kind: PrincipalKind;
  isExternal: boolean;
  isEveryone: boolean;
  isSharingLink: boolean;
  roles: string[];
}

export interface BrokenItem {
  siteUrl: string;
  listTitle: string;
  itemId: number;
  title: string;
  url: string;
}

export interface UniqueScope {
  siteUrl: string;
  listId: string;
  title: string;
  url: string;
  templateName: string;
  itemCount: number;
  itemsChecked?: number;
  itemsWithUniquePermissions?: number;
  error?: string;
}
