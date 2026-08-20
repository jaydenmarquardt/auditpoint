export type UserKind = "user" | "securityGroup" | "sharePointGroup" | "other";

export interface SiteUser {
  siteUrl: string;
  id: number;
  title: string;
  loginName: string;
  email: string;
  kind: UserKind;
  isSiteAdmin: boolean;
  isExternal: boolean;
  isSystem: boolean;
  /** From the user information list, so it is when SharePoint first saw them here. */
  createdIso?: string;
  modifiedIso?: string;
  deleted?: boolean;
}

export interface UserProfileSummary {
  loginName: string;
  displayName: string;
  email: string;
  department: string;
  jobTitle: string;
  office: string;
  hasPicture: boolean;
  propertyCount: number;
  error?: string;
}
