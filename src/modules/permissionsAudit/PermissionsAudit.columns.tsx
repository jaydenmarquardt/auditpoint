import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { IconButton } from "@/components/actions/IconButton";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SiteLists } from "@/api/Lists.api";
import { PermissionGrant, PermissionLevel, SiteGroupSummary, UniqueScope } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { hasFullControl, kindLabel } from "@/modules/permissionsAudit/PermissionsAudit.logic";
import { formatNumber } from "@/utils/Format.util";

export function groupColumns(onSelect: (group: SiteGroupSummary) => void): TableColumn<SiteGroupSummary>[] {
  return [
    {
      key: "title",
      header: PermissionsAuditContent.columns.group,
      minWidth: 260,
      maxWidth: 360,
      sortValue: (group) => group.title,
      render: (group) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{group.title}</div>
          {group.description && (
            <div
              style={{
                fontSize: Theme.tokens.font.sm,
                color: Theme.palette().textMuted,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {group.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "owner",
      header: PermissionsAuditContent.columns.owner,
      minWidth: 180,
      sortValue: (group) => group.ownerTitle,
      render: (group) => <span>{group.ownerTitle || "-"}</span>,
    },
    {
      key: "members",
      header: PermissionsAuditContent.columns.members,
      minWidth: 110,
      sortValue: (group) => group.memberCount,
      render: (group) => <span>{formatNumber(group.memberCount)}</span>,
    },
    {
      key: "membership",
      header: PermissionsAuditContent.columns.membership,
      minWidth: 220,
      sortValue: (group) => (group.allowMembersEditMembership ? 1 : 0),
      filterValue: (group) =>
        group.allowMembersEditMembership
          ? PermissionsAuditContent.membershipOpen
          : PermissionsAuditContent.membershipClosed,
      render: (group) => (
        <Badge
          label={
            group.allowMembersEditMembership
              ? PermissionsAuditContent.membershipOpen
              : PermissionsAuditContent.membershipClosed
          }
          tone={group.allowMembersEditMembership ? "warning" : "neutral"}
          showIcon={false}
        />
      ),
    },
    {
      key: "flags",
      header: PermissionsAuditContent.columns.flags,
      minWidth: 150,
      filterValue: (group) => (group.isSharingLink ? PermissionsAuditContent.flags.sharing : "Standard"),
      render: (group) =>
        group.isSharingLink ? (
          <Badge label={PermissionsAuditContent.flags.sharing} tone="info" showIcon={false} />
        ) : (
          <span style={{ color: Theme.palette().textMuted }}>-</span>
        ),
    },
    {
      key: "actions",
      header: PermissionsAuditContent.columns.actions,
      minWidth: 100,
      render: (group) => (
        <IconButton
          iconName="Info"
          ariaLabel={`Details: ${group.title}`}
          tooltip="Details"
          onClick={() => onSelect(group)}
        />
      ),
    },
  ];
}

export const levelColumns: TableColumn<PermissionLevel>[] = [
  {
    key: "name",
    header: PermissionsAuditContent.columns.level,
    minWidth: 220,
    sortValue: (level) => level.name,
    render: (level) => <span style={{ fontWeight: 600 }}>{level.name}</span>,
  },
  {
    key: "type",
    header: PermissionsAuditContent.columns.type,
    minWidth: 140,
    sortValue: (level) => (level.isCustom ? 0 : 1),
    filterValue: (level) => (level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn),
    render: (level) => (
      <Badge
        label={level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn}
        tone={level.isCustom ? "warning" : "neutral"}
      />
    ),
  },
  {
    key: "rights",
    header: PermissionsAuditContent.level.rights,
    minWidth: 320,
    maxWidth: 520,
    sortValue: (level) => (level.permissions ?? []).length,
    render: (level) => (
      <span style={{ color: Theme.palette().textMuted }}>
        {(level.permissions ?? []).slice(0, 4).join(", ") || "-"}
        {(level.permissions ?? []).length > 4 ? ` +${(level.permissions ?? []).length - 4}` : ""}
      </span>
    ),
  },
  {
    key: "description",
    header: PermissionsAuditContent.columns.description,
    minWidth: 320,
    maxWidth: 520,
    sortValue: (level) => level.description,
    render: (level) => <span style={{ color: Theme.palette().textMuted }}>{level.description || "-"}</span>,
  },
];

export const grantColumns: TableColumn<PermissionGrant>[] = [
  {
    key: "principal",
    header: PermissionsAuditContent.columns.principal,
    minWidth: 260,
    maxWidth: 360,
    sortValue: (grant) => grant.principalTitle,
    filterValue: (grant) => grant.principalTitle,
    render: (grant) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{grant.principalTitle}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {grant.loginName}
        </div>
      </div>
    ),
  },
  {
    key: "kind",
    header: PermissionsAuditContent.columns.kind,
    minWidth: 160,
    sortValue: (grant) => kindLabel(grant.kind),
    filterValue: (grant) => kindLabel(grant.kind),
    render: (grant) => (
      <Badge label={kindLabel(grant.kind)} tone={grant.kind === "user" ? "warning" : "neutral"} showIcon={false} />
    ),
  },
  {
    key: "scope",
    header: PermissionsAuditContent.columns.scope,
    minWidth: 200,
    maxWidth: 280,
    sortValue: (grant) => grant.scopeTitle,
    filterValue: (grant) => grant.scopeTitle,
    render: (grant) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{grant.scopeTitle}</div>
        <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
          {PermissionsAuditContent.scope[grant.scope]}
        </div>
      </div>
    ),
  },
  {
    key: "scopeType",
    header: PermissionsAuditContent.columns.scopeType,
    minWidth: 130,
    sortValue: (grant) => grant.scope,
    filterValue: (grant) => PermissionsAuditContent.scope[grant.scope],
    render: (grant) => <Badge label={PermissionsAuditContent.scope[grant.scope]} tone="neutral" showIcon={false} />,
  },
  {
    key: "roles",
    header: PermissionsAuditContent.columns.roles,
    minWidth: 240,
    maxWidth: 340,
    sortValue: (grant) => grant.roles.join(", "),
    filterValue: (grant) => grant.roles[0] ?? "-",
    render: (grant) => <span>{grant.roles.join(", ") || "-"}</span>,
  },
  {
    key: "flags",
    header: PermissionsAuditContent.columns.flags,
    minWidth: 220,
    filterValue: (grant) => flagsOf(grant)[0] ?? "Standard",
    render: (grant) => {
      const flags = flagsOf(grant);

      return flags.length === 0 ? (
        <span style={{ color: Theme.palette().textMuted }}>-</span>
      ) : (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {flags.map((flag) => (
            <Badge key={flag} label={flag} tone="warning" showIcon={false} />
          ))}
        </div>
      );
    },
  },
];

export function flagsOf(grant: PermissionGrant): string[] {
  const flags: string[] = [];
  if (grant.isEveryone) flags.push(PermissionsAuditContent.flags.everyone);
  if (grant.isExternal) flags.push(PermissionsAuditContent.flags.external);
  if (grant.isSharingLink) flags.push(PermissionsAuditContent.flags.sharing);
  if (hasFullControl(grant)) flags.push(PermissionsAuditContent.flags.fullControl);
  return flags;
}

export const scopeColumns: TableColumn<UniqueScope>[] = [
  {
    key: "title",
    header: PermissionsAuditContent.columns.list,
    minWidth: 280,
    maxWidth: 380,
    sortValue: (scope) => scope.title,
    render: (scope) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{scope.title}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {scope.url}
        </div>
      </div>
    ),
  },
  {
    key: "template",
    header: PermissionsAuditContent.columns.template,
    minWidth: 160,
    sortValue: (scope) => scope.templateName,
    filterValue: (scope) => scope.templateName,
    render: (scope) => <Badge label={scope.templateName} tone="neutral" showIcon={false} />,
  },
  {
    key: "items",
    header: PermissionsAuditContent.columns.items,
    minWidth: 110,
    sortValue: (scope) => scope.itemCount,
    render: (scope) => <span>{formatNumber(scope.itemCount)}</span>,
  },
  {
    key: "sampled",
    header: PermissionsAuditContent.columns.sampled,
    minWidth: 120,
    sortValue: (scope) => scope.itemsChecked ?? -1,
    render: (scope) => <span>{scope.itemsChecked === undefined ? "-" : formatNumber(scope.itemsChecked)}</span>,
  },
  {
    key: "broken",
    header: PermissionsAuditContent.columns.broken,
    minWidth: 220,
    sortValue: (scope) => scope.itemsWithUniquePermissions ?? -1,
    render: (scope) =>
      scope.itemsWithUniquePermissions === undefined ? (
        <span>-</span>
      ) : (
        <Badge
          label={formatNumber(scope.itemsWithUniquePermissions)}
          tone={scope.itemsWithUniquePermissions > 0 ? "warning" : "success"}
          showIcon={false}
        />
      ),
  },
  {
    key: "actions",
    header: PermissionsAuditContent.columns.actions,
    minWidth: 110,
    render: (scope) => (
      <IconButton
        iconName="Permissions"
        ariaLabel={`${PermissionsAuditContent.openPermissions}: ${scope.title}`}
        tooltip={PermissionsAuditContent.openPermissions}
        onClick={() =>
          window.open(
            SiteLists(scope.siteUrl).permissionsUrl({ id: scope.listId } as never),
            "_blank",
            "noopener"
          )
        }
      />
    ),
  },
];
