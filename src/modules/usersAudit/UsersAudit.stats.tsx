import * as React from "react";
import { StatTile } from "@/components/layout/StatTile";
import { Theme } from "@/theme/Theme.api";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditConfig, UsersAuditView } from "@/modules/usersAudit/UsersAudit.types";
import { formatNumber } from "@/utils/Format.util";

export const UsersAuditStats: React.FC<{ view: UsersAuditView; config: UsersAuditConfig }> = ({
  view,
  config,
}) => {
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
        iconName="People" label={UsersAuditContent.stats.people} value={formatNumber(totals.people)} info={UsersAuditContent.tileInfo.people} />
      <StatTile
        iconName="People" label={UsersAuditContent.stats.users} value={formatNumber(totals.users)} info={UsersAuditContent.tileInfo.users} />
      <StatTile
        iconName="Shield"
        label={UsersAuditContent.stats.security}
        value={formatNumber(totals.securityGroups)}
        info={UsersAuditContent.tileInfo.security}
      />
      <StatTile
        iconName="Globe"
        label={UsersAuditContent.stats.external}
        value={formatNumber(totals.external)}
        tone="warning"
        badge={totals.external > 0 ? UsersAuditContent.review : undefined}
        info={UsersAuditContent.tileInfo.external}
      />
      <StatTile
        iconName="Admin"
        label={UsersAuditContent.stats.admins}
        value={formatNumber(totals.siteAdmins)}
        tone="warning"
        info={UsersAuditContent.tileInfo.admins}
      />
      <StatTile
        iconName="System" label={UsersAuditContent.stats.system} value={formatNumber(totals.system)} info={UsersAuditContent.tileInfo.system} />
      <StatTile
        iconName="AddFriend"
        label={`${UsersAuditContent.stats.added} (${config.months}m)`}
        value={formatNumber(totals.addedInWindow)}
        info={UsersAuditContent.tileInfo.added}
      />
      <StatTile
        iconName="UserFollowed"
        label={`${UsersAuditContent.stats.active} (${config.recentDays}d)`}
        value={formatNumber(totals.activeRecently)}
        info={UsersAuditContent.tileInfo.active}
      />
      <StatTile
        iconName="UserPause"
        label={UsersAuditContent.stats.dormant}
        value={formatNumber(totals.dormant)}
        tone="warning"
        info={UsersAuditContent.tileInfo.dormant}
      />
      <StatTile
        iconName="Group"
        label={UsersAuditContent.stats.groups}
        value={config.readGroups ? formatNumber(totals.groups) : "-"}
        info={UsersAuditContent.tileInfo.groups}
      />
      <StatTile
        iconName="Calculator"
        label={UsersAuditContent.stats.average}
        value={config.readGroups ? String(totals.averageGroupSize) : "-"}
        info={UsersAuditContent.tileInfo.average}
      />
      <StatTile
        iconName="UserOptional"
        label={UsersAuditContent.stats.ungrouped}
        value={config.readGroups ? formatNumber(totals.usersWithoutGroup) : "-"}
        tone="warning"
        info={UsersAuditContent.tileInfo.ungrouped}
      />
      <StatTile
        iconName="ContactCard"
        label={UsersAuditContent.stats.profiles}
        value={config.readProfiles ? formatNumber(totals.profilesRead) : "-"}
        hint={config.readProfiles ? `${formatNumber(totals.withDepartment)} with a department` : undefined}
        info={UsersAuditContent.tileInfo.profiles}
      />
    </div>
  );
};
