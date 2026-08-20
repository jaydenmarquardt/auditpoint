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
        maxWidth: 1240,
        minWidth: 0,
      }}
    >
      <StatTile
        label={PermissionsAuditContent.stats.groups}
        value={formatNumber(totals.groups)}
        info={PermissionsAuditContent.tileInfo.groups}
      />
      <StatTile
        label={PermissionsAuditContent.stats.members}
        value={config.readGroupMembers ? formatNumber(totals.members) : "-"}
        info={PermissionsAuditContent.tileInfo.members}
      />
      <StatTile
        label={PermissionsAuditContent.stats.empty}
        value={config.readGroupMembers ? formatNumber(totals.emptyGroups) : "-"}
        info={PermissionsAuditContent.tileInfo.empty}
      />
      <StatTile
        label={PermissionsAuditContent.stats.levels}
        value={formatNumber(totals.levels)}
        hint={`${formatNumber(totals.customLevels)} custom`}
        info={PermissionsAuditContent.tileInfo.levels}
      />
      <StatTile
        label={PermissionsAuditContent.stats.grants}
        value={formatNumber(totals.grants)}
        info={PermissionsAuditContent.tileInfo.grants}
      />
      <StatTile
        label={PermissionsAuditContent.stats.direct}
        value={formatNumber(totals.directUserGrants)}
        tone="warning"
        badge={totals.directUserGrants > 0 ? PermissionsAuditContent.review : undefined}
        info={PermissionsAuditContent.tileInfo.direct}
      />
      <StatTile
        label={PermissionsAuditContent.stats.fullControl}
        value={formatNumber(totals.fullControlGrants)}
        tone="warning"
        info={PermissionsAuditContent.tileInfo.fullControl}
      />
      <StatTile
        label={PermissionsAuditContent.stats.external}
        value={formatNumber(totals.externalPrincipals)}
        tone="warning"
        badge={totals.externalPrincipals > 0 ? PermissionsAuditContent.review : undefined}
        info={PermissionsAuditContent.tileInfo.external}
      />
      <StatTile
        label={PermissionsAuditContent.stats.everyone}
        value={formatNumber(totals.everyoneGrants)}
        tone="warning"
        info={PermissionsAuditContent.tileInfo.everyone}
      />
      <StatTile
        label={PermissionsAuditContent.stats.sharing}
        value={formatNumber(totals.sharingLinks)}
        info={PermissionsAuditContent.tileInfo.sharing}
      />
      <StatTile
        label={PermissionsAuditContent.stats.unique}
        value={formatNumber(totals.uniqueLists)}
        info={PermissionsAuditContent.tileInfo.unique}
      />
      <StatTile
        label={PermissionsAuditContent.stats.itemBreaks}
        value={config.checkItemBreaks ? formatNumber(totals.itemBreaks) : "-"}
        hint={config.checkItemBreaks ? `${formatNumber(totals.itemsChecked)} sampled` : undefined}
        info={PermissionsAuditContent.tileInfo.itemBreaks}
      />
    </div>
  );
};
