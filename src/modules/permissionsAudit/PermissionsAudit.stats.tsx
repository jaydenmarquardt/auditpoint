import * as React from "react";
import { StatTile } from "@/components/layout/StatTile";
import { Theme } from "@/theme/Theme.api";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { PermissionsAuditConfig, PermissionsAuditView } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const PermissionsAuditStats: React.FC<{
  view: PermissionsAuditView;
  config: PermissionsAuditConfig;
}> = ({ view, config }) => {
  const { totals } = view;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: Theme.tokens.space.md,
        width: "100%",
        minWidth: 0,
      }}
    >
      <StatTile
        iconName="Group"
        label={PermissionsAuditContent.stats.groups}
        value={formatNumber(totals.groups)}
        info={PermissionsAuditContent.tileInfo.groups}
      />
      <StatTile
        iconName="People"
        label={PermissionsAuditContent.stats.members}
        value={formatNumber(totals.members)}
        unavailable={!(config.readGroupMembers)}
        info={PermissionsAuditContent.tileInfo.members}
      />
      <StatTile
        iconName="FieldEmpty"
        label={PermissionsAuditContent.stats.empty}
        value={formatNumber(totals.emptyGroups)}
        unavailable={!(config.readGroupMembers)}
        info={PermissionsAuditContent.tileInfo.empty}
      />
      <StatTile
        iconName="Permissions"
        label={PermissionsAuditContent.stats.levels}
        value={formatNumber(totals.levels)}
        hint={`${formatNumber(totals.customLevels)} custom`}
        info={PermissionsAuditContent.tileInfo.levels}
      />
      <StatTile
        iconName="Permissions"
        label={PermissionsAuditContent.stats.grants}
        value={formatNumber(totals.grants)}
        info={PermissionsAuditContent.tileInfo.grants}
      />
      <StatTile
        iconName="UserOptional"
        label={PermissionsAuditContent.stats.direct}
        value={formatNumber(totals.directUserGrants)}
        tone="warning"
        badge={totals.directUserGrants > 0 ? PermissionsAuditContent.review : undefined}
        info={PermissionsAuditContent.tileInfo.direct}
      />
      <StatTile
        iconName="Permissions"
        label={PermissionsAuditContent.stats.fullControl}
        value={formatNumber(totals.fullControlGrants)}
        tone="warning"
        info={PermissionsAuditContent.tileInfo.fullControl}
      />
      <StatTile
        iconName="Globe"
        label={PermissionsAuditContent.stats.external}
        value={formatNumber(totals.externalPrincipals)}
        tone="warning"
        badge={totals.externalPrincipals > 0 ? PermissionsAuditContent.review : undefined}
        info={PermissionsAuditContent.tileInfo.external}
      />
      <StatTile
        iconName="People"
        label={PermissionsAuditContent.stats.everyone}
        value={formatNumber(totals.everyoneGrants)}
        tone="warning"
        info={PermissionsAuditContent.tileInfo.everyone}
      />
      <StatTile
        iconName="Share"
        label={PermissionsAuditContent.stats.sharing}
        value={formatNumber(totals.sharingLinks)}
        info={PermissionsAuditContent.tileInfo.sharing}
      />
      <StatTile
        iconName="BranchFork2"
        label={PermissionsAuditContent.stats.unique}
        value={formatNumber(totals.uniqueLists)}
        info={PermissionsAuditContent.tileInfo.unique}
      />
      <StatTile
        iconName="BranchFork2"
        label={PermissionsAuditContent.stats.itemBreaks}
        value={formatNumber(totals.itemBreaks)}
        unavailable={!(config.checkItemBreaks)}
        hint={config.checkItemBreaks ? `${formatNumber(totals.itemsChecked)} sampled` : undefined}
        info={PermissionsAuditContent.tileInfo.itemBreaks}
      />
    </div>
  );
};
