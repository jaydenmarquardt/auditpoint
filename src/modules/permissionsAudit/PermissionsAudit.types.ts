import { SiteList } from "@/api/Lists.types";
import {
  BrokenItem,
  PermissionGrant,
  PermissionLevel,
  SiteGroupSummary,
  UniqueScope,
} from "@/api/SitePermissions.types";

export interface PermissionsAuditConfig {
  readGroupMembers: boolean;
  includeHidden: boolean;
  readListGrants: boolean;
  checkItemBreaks: boolean;
  itemBreakScope: string;
  itemSampleSize: number;
  maxLists: number;
}

export interface PermissionsAuditData {
  levels: PermissionLevel[];
  groups: SiteGroupSummary[];
  grants: PermissionGrant[];
  scopes: UniqueScope[];
  brokenItems: BrokenItem[];
  allLists: SiteList[];
  listCount: number;
  scannedSites: string[];
}

export interface PermissionsTotals {
  groups: number;
  members: number;
  emptyGroups: number;
  levels: number;
  customLevels: number;
  grants: number;
  directUserGrants: number;
  groupGrants: number;
  externalPrincipals: number;
  everyoneGrants: number;
  sharingLinks: number;
  lists: number;
  uniqueLists: number;
  itemsChecked: number;
  itemBreaks: number;
  fullControlGrants: number;
}

export interface PermissionsAuditView {
  totals: PermissionsTotals;
  grantsByKind: { label: string; value: number }[];
  grantsByLevel: { label: string; value: number }[];
  membersByGroup: { label: string; value: number }[];
  inheritanceSplit: { label: string; value: number }[];
  directGrants: PermissionGrant[];
  riskyGrants: PermissionGrant[];
}
