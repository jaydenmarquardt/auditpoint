import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Theme } from "@/theme/Theme.api";
import { PermissionGrant, PermissionLevel } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { formatNumber } from "@/utils/Format.util";

export interface LevelDialogProps {
  level?: PermissionLevel;
  grants: PermissionGrant[];
  onDismiss: () => void;
}

export const LevelDialog: React.FC<LevelDialogProps> = ({ level, grants, onDismiss }) => {
  if (!level) return null;

  const rights = level.permissions ?? [];

  const holders = grants.filter((grant) => grant.roles.indexOf(level.name) !== -1);

  return (
    <PreviewDialog
      open={Boolean(level)}
      onDismiss={onDismiss}
      title={level.name}
      description={level.description || undefined}
      facts={[
        {
          label: PermissionsAuditContent.columns.type,
          value: (
            <Badge
              label={level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn}
              tone={level.isCustom ? "warning" : "neutral"}
            />
          ),
        },
        { label: PermissionsAuditContent.level.rights, value: formatNumber(rights.length) },
        { label: PermissionsAuditContent.level.holders, value: formatNumber(holders.length) },
      ]}
      actions={<Button label="Close" variant="primary" onClick={onDismiss} />}
      sections={[
        {
          key: "rights",
          title: PermissionsAuditContent.level.rights,
          content:
            rights.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{PermissionsAuditContent.level.noRights}</p>
            ) : (
              <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" }}>
                {rights.map((permission) => (
                  <Badge key={permission} label={permission} tone="info" showIcon={false} />
                ))}
              </div>
            ),
        },
        {
          key: "holders",
          title: PermissionsAuditContent.level.holders,
          content:
            holders.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{PermissionsAuditContent.level.noHolders}</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: Theme.tokens.space.lg }}>
                {holders.map((grant) => (
                  <li key={`${grant.scope}-${grant.scopeUrl}-${grant.principalId}`}>
                    {grant.principalTitle} on {grant.scopeTitle} ({PermissionsAuditContent.scope[grant.scope]})
                  </li>
                ))}
              </ul>
            ),
        },
      ]}
    />
  );
};
