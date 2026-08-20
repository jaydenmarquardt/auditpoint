import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Spinner } from "@/components/feedback/Spinner";
import { Table } from "@/components/data/Table";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SiteUsers } from "@/api/Users.api";
import { SiteUser, UserProfileSummary } from "@/api/Users.types";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { kindLabel } from "@/modules/usersAudit/UsersAudit.logic";
import { formatDate, formatNumber } from "@/utils/Format.util";

export interface UserDialogProps {
  user?: SiteUser;
  profiles: UserProfileSummary[];
  groups: string[];
  onLoaded: (profile: UserProfileSummary) => void;
  onDismiss: () => void;
}

interface PropertyRow {
  key: string;
  value: string;
}

const columns: TableColumn<PropertyRow>[] = [
  {
    key: "key",
    header: "Property",
    minWidth: 220,
    sortValue: (row) => row.key,
    render: (row) => <code style={{ fontSize: Theme.tokens.font.sm }}>{row.key}</code>,
  },
  {
    key: "value",
    header: "Value",
    minWidth: 360,
    maxWidth: 620,
    sortValue: (row) => row.value,
    render: (row) => <span style={{ wordBreak: "break-word" }}>{row.value}</span>,
  },
];

export const UserDialog: React.FC<UserDialogProps> = ({ user, profiles, groups, onLoaded, onDismiss }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const profile = user ? profiles.find((entry) => entry.loginName === user.loginName) : undefined;

  // Profiles are sampled during the run, so anyone outside the sample loads on demand.
  React.useEffect(() => {
    if (!user || profile || loading) return;

    setLoading(true);
    setError(undefined);

    SiteUsers(user.siteUrl)
      .profile(user.loginName)
      .then((loaded) => {
        onLoaded(loaded);
        if (loaded.error) setError(loaded.error);
      })
      .catch(() => setError("The profile service did not return this user."))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [user, profile, loading, onLoaded]);

  if (!user) return null;

  const properties: PropertyRow[] = [
    { key: "Login name", value: user.loginName },
    { key: "Email", value: user.email || "-" },
    { key: "Type", value: kindLabel(user.kind) },
    { key: "Site admin", value: user.isSiteAdmin ? UsersAuditContent.yes : UsersAuditContent.no },
    { key: "External", value: user.isExternal ? UsersAuditContent.yes : UsersAuditContent.no },
    { key: "First seen", value: user.createdIso ? formatDate(user.createdIso) : "-" },
    { key: "Record changed", value: user.modifiedIso ? formatDate(user.modifiedIso) : "-" },
    ...(profile
      ? [
          { key: "Display name", value: profile.displayName || "-" },
          { key: "Department", value: profile.department || "-" },
          { key: "Job title", value: profile.jobTitle || "-" },
          { key: "Office", value: profile.office || "-" },
          { key: "Profile photo", value: profile.hasPicture ? UsersAuditContent.yes : UsersAuditContent.no },
          { key: "Profile properties set", value: formatNumber(profile.propertyCount) },
        ]
      : []),
  ];

  return (
    <PreviewDialog
      open={Boolean(user)}
      onDismiss={onDismiss}
      title={user.title}
      description={user.loginName}
      facts={[
        { label: UsersAuditContent.columns.kind, value: kindLabel(user.kind) },
        { label: UsersAuditContent.columns.email, value: user.email || "-" },
        { label: UsersAuditContent.columns.created, value: user.createdIso ? formatDate(user.createdIso) : "-" },
        { label: UsersAuditContent.columns.modified, value: user.modifiedIso ? formatDate(user.modifiedIso) : "-" },
        {
          label: UsersAuditContent.columns.groups,
          value:
            groups.length === 0 ? (
              <span style={{ color: Theme.palette().textMuted }}>-</span>
            ) : (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {groups.map((group) => (
                  <Badge key={group} label={group} tone="neutral" showIcon={false} />
                ))}
              </div>
            ),
        },
      ]}
      actions={<Button label="Close" variant="primary" onClick={onDismiss} />}
      sections={[
        {
          key: "properties",
          title: UsersAuditContent.columns.properties,
          content: loading ? (
            <Spinner label="Loading profile" />
          ) : (
            <>
              {error && (
                <p style={{ margin: `0 0 ${Theme.tokens.space.sm}`, color: Theme.tone("warning").fg }}>{error}</p>
              )}
              <Table
                ariaLabel={`${user.title} properties`}
                rows={properties}
                columns={columns}
                getRowKey={(row) => row.key}
                maxHeight={420}
              />
            </>
          ),
        },
      ]}
    />
  );
};
