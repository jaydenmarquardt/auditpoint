import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SiteGroupSummary } from "@/api/SitePermissions.types";
import { SiteUser, UserProfileSummary } from "@/api/Users.types";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { isDormant, kindLabel } from "@/modules/usersAudit/UsersAudit.logic";
import { formatDate, formatNumber } from "@/utils/Format.util";

export function userColumns(
  recentDays: number,
  groupsFor: (user: SiteUser) => string[]
): TableColumn<SiteUser>[] {
  return [
    {
      key: "title",
      header: UsersAuditContent.columns.user,
      minWidth: 260,
      maxWidth: 360,
      sortValue: (user) => user.title,
      render: (user) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{user.title}</div>
          <div
            style={{
              fontSize: Theme.tokens.font.sm,
              color: Theme.palette().textMuted,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.loginName}
          </div>
        </div>
      ),
    },
    {
      key: "kind",
      header: UsersAuditContent.columns.kind,
      minWidth: 160,
      sortValue: (user) => kindLabel(user.kind),
      filterValue: (user) => kindLabel(user.kind),
      render: (user) => <Badge label={kindLabel(user.kind)} tone="neutral" showIcon={false} />,
    },
    {
      key: "email",
      header: UsersAuditContent.columns.email,
      minWidth: 240,
      sortValue: (user) => user.email,
      render: (user) => <span>{user.email || "-"}</span>,
    },
    {
      key: "created",
      header: UsersAuditContent.columns.created,
      minWidth: 150,
      sortValue: (user) => user.createdIso ?? "",
      render: (user) => <span>{user.createdIso ? formatDate(user.createdIso) : "-"}</span>,
    },
    {
      key: "modified",
      header: UsersAuditContent.columns.modified,
      minWidth: 160,
      sortValue: (user) => user.modifiedIso ?? "",
      render: (user) => <span>{user.modifiedIso ? formatDate(user.modifiedIso) : "-"}</span>,
    },
    {
      key: "groups",
      header: UsersAuditContent.columns.groups,
      minWidth: 220,
      maxWidth: 320,
      sortValue: (user) => groupsFor(user).length,
      render: (user) => (
        <span style={{ color: Theme.palette().textMuted }}>{groupsFor(user).join(", ") || "-"}</span>
      ),
    },
    {
      key: "flags",
      header: UsersAuditContent.columns.flags,
      minWidth: 220,
      filterValue: (user) => userFlags(user, recentDays)[0] ?? "Standard",
      render: (user) => {
        const flags = userFlags(user, recentDays);

        return flags.length === 0 ? (
          <span style={{ color: Theme.palette().textMuted }}>-</span>
        ) : (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {flags.map((flag) => (
              <Badge key={flag} label={flag} tone={flag === UsersAuditContent.flags.system ? "neutral" : "warning"} showIcon={false} />
            ))}
          </div>
        );
      },
    },
  ];
}

export function userFlags(user: SiteUser, recentDays: number): string[] {
  const flags: string[] = [];
  if (user.isExternal) flags.push(UsersAuditContent.flags.external);
  if (user.isSiteAdmin) flags.push(UsersAuditContent.flags.admin);
  if (user.isSystem) flags.push(UsersAuditContent.flags.system);
  if (user.kind === "user" && isDormant(user, recentDays)) flags.push(UsersAuditContent.flags.dormant);
  return flags;
}

export function groupSettingsUrl(group: SiteGroupSummary): string {
  const site = (group.siteUrl ?? "").replace(/\/$/, "");
  return `${site}/_layouts/15/people.aspx?MembershipGroupId=${group.id}`;
}

export const groupColumns: TableColumn<SiteGroupSummary>[] = [
  {
    key: "title",
    header: UsersAuditContent.columns.group,
    minWidth: 280,
    sortValue: (group) => group.title,
    render: (group) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{group.title}</div>
        {group.description && (
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{group.description}</div>
        )}
      </div>
    ),
  },
  {
    key: "owner",
    header: UsersAuditContent.columns.owner,
    minWidth: 200,
    sortValue: (group) => group.ownerTitle,
    render: (group) => <span>{group.ownerTitle || "-"}</span>,
  },
  {
    key: "members",
    header: UsersAuditContent.columns.members,
    minWidth: 120,
    sortValue: (group) => group.memberCount,
    render: (group) => <span>{formatNumber(group.memberCount)}</span>,
  },
];

export const profileColumns: TableColumn<UserProfileSummary>[] = [
  {
    key: "displayName",
    header: UsersAuditContent.columns.user,
    minWidth: 260,
    sortValue: (profile) => profile.displayName || profile.loginName,
    render: (profile) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{profile.displayName || profile.loginName}</div>
        <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{profile.email || "-"}</div>
      </div>
    ),
  },
  {
    key: "department",
    header: UsersAuditContent.columns.department,
    minWidth: 200,
    sortValue: (profile) => profile.department,
    filterValue: (profile) => profile.department || "-",
    render: (profile) => <span>{profile.department || "-"}</span>,
  },
  {
    key: "jobTitle",
    header: UsersAuditContent.columns.jobTitle,
    minWidth: 220,
    sortValue: (profile) => profile.jobTitle,
    render: (profile) => <span>{profile.jobTitle || "-"}</span>,
  },
  {
    key: "office",
    header: UsersAuditContent.columns.office,
    minWidth: 180,
    sortValue: (profile) => profile.office,
    filterValue: (profile) => profile.office || "-",
    render: (profile) => <span>{profile.office || "-"}</span>,
  },
  {
    key: "photo",
    header: UsersAuditContent.columns.photo,
    minWidth: 110,
    sortValue: (profile) => (profile.hasPicture ? 1 : 0),
    filterValue: (profile) => (profile.hasPicture ? UsersAuditContent.yes : UsersAuditContent.no),
    render: (profile) => (
      <Badge
        label={profile.hasPicture ? UsersAuditContent.yes : UsersAuditContent.no}
        tone={profile.hasPicture ? "success" : "neutral"}
        showIcon={false}
      />
    ),
  },
  {
    key: "properties",
    header: UsersAuditContent.columns.properties,
    minWidth: 150,
    sortValue: (profile) => profile.propertyCount,
    render: (profile) => <span>{formatNumber(profile.propertyCount)}</span>,
  },
];
