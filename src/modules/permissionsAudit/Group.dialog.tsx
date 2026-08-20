import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Table } from "@/components/data/Table";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { GroupMember, PermissionGrant, SiteGroupSummary } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { kindLabel } from "@/modules/permissionsAudit/PermissionsAudit.logic";
import { formatNumber } from "@/utils/Format.util";

export interface GroupDialogProps {
  group?: SiteGroupSummary;
  grants: PermissionGrant[];
  onDismiss: () => void;
}

const memberColumns: TableColumn<GroupMember>[] = [
  {
    key: "title",
    header: "Member",
    minWidth: 240,
    sortValue: (member) => member.title,
    render: (member) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{member.title}</div>
        <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{member.loginName}</div>
      </div>
    ),
  },
  {
    key: "kind",
    header: PermissionsAuditContent.columns.kind,
    minWidth: 160,
    sortValue: (member) => kindLabel(member.kind),
    filterValue: (member) => kindLabel(member.kind),
    render: (member) => <Badge label={kindLabel(member.kind)} tone="neutral" showIcon={false} />,
  },
  {
    key: "flags",
    header: PermissionsAuditContent.columns.flags,
    minWidth: 180,
    filterValue: (member) =>
      member.isExternal
        ? PermissionsAuditContent.flags.external
        : member.isSiteAdmin
          ? PermissionsAuditContent.flags.siteAdmin
          : "Standard",
    render: (member) => (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {member.isExternal && <Badge label={PermissionsAuditContent.flags.external} tone="warning" showIcon={false} />}
        {member.isSiteAdmin && <Badge label={PermissionsAuditContent.flags.siteAdmin} tone="danger" showIcon={false} />}
        {!member.isExternal && !member.isSiteAdmin && <span style={{ color: Theme.palette().textMuted }}>-</span>}
      </div>
    ),
  },
];

export const GroupDialog: React.FC<GroupDialogProps> = ({ group, grants, onDismiss }) => {
  if (!group) return null;

  const groupGrants = grants.filter((grant) => grant.principalTitle === group.title);

  return (
    <PreviewDialog
      open={Boolean(group)}
      onDismiss={onDismiss}
      title={group.title}
      description={group.description || undefined}
      facts={[
        { label: PermissionsAuditContent.columns.owner, value: group.ownerTitle || "-" },
        { label: PermissionsAuditContent.columns.members, value: formatNumber(group.memberCount) },
        {
          label: PermissionsAuditContent.columns.membership,
          value: group.allowMembersEditMembership
            ? PermissionsAuditContent.membershipOpen
            : PermissionsAuditContent.membershipClosed,
        },
        {
          label: PermissionsAuditContent.columns.roles,
          value: [...new Set(groupGrants.flatMap((grant) => grant.roles))].join(", ") || "-",
        },
        { label: "Login name", value: <code>{group.loginName || "-"}</code> },
      ]}
      actions={<Button label="Close" variant="primary" onClick={onDismiss} />}
      sections={[
        {
          key: "members",
          title: PermissionsAuditContent.columns.members,
          content:
            group.members.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>
                {group.error ?? "No members, or membership was not read for this run."}
              </p>
            ) : (
              <Table
                ariaLabel={`${group.title} members`}
                rows={group.members}
                columns={memberColumns}
                getRowKey={(member) => member.loginName}
                searchValue={(member) => `${member.title} ${member.loginName} ${member.email}`}
                searchLabel="Search members"
                maxHeight={360}
              />
            ),
        },
        {
          key: "grants",
          title: PermissionsAuditContent.columns.scope,
          content:
            groupGrants.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>
                This group holds no role assignments in the scopes that were read.
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: Theme.tokens.space.lg }}>
                {groupGrants.map((grant) => (
                  <li key={`${grant.scope}-${grant.scopeUrl}`}>
                    {grant.scopeTitle} ({PermissionsAuditContent.scope[grant.scope]}): {grant.roles.join(", ")}
                  </li>
                ))}
              </ul>
            ),
        },
      ]}
    />
  );
};
