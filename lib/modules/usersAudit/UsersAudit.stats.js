import * as React from "react";
import { StatTile } from "../../components/layout/StatTile";
import { Theme } from "../../theme/Theme.api";
import { UsersAuditContent } from "./UsersAudit.content";
import { formatNumber } from "../../utils/Format.util";
export const UsersAuditStats = ({ view, config, }) => {
    const { totals } = view;
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 } },
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "People"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "People", label: UsersAuditContent.stats.people, value: formatNumber(totals.people), info: UsersAuditContent.tileInfo.people }),
                React.createElement(StatTile, { iconName: "People", label: UsersAuditContent.stats.users, value: formatNumber(totals.users), info: UsersAuditContent.tileInfo.users }),
                React.createElement(StatTile, { iconName: "Shield", label: UsersAuditContent.stats.security, value: formatNumber(totals.securityGroups), info: UsersAuditContent.tileInfo.security }),
                React.createElement(StatTile, { iconName: "Globe", label: UsersAuditContent.stats.external, value: formatNumber(totals.external), tone: "warning", badge: totals.external > 0 ? UsersAuditContent.review : undefined, info: UsersAuditContent.tileInfo.external }),
                React.createElement(StatTile, { iconName: "UserFollowed", label: `${UsersAuditContent.stats.active} (${config.recentDays}d)`, value: formatNumber(totals.activeRecently), info: UsersAuditContent.tileInfo.active }),
                React.createElement(StatTile, { iconName: "AddFriend", label: `${UsersAuditContent.stats.added} (${config.months}m)`, value: formatNumber(totals.addedInWindow), info: UsersAuditContent.tileInfo.added }),
                React.createElement(StatTile, { iconName: "UserPause", label: UsersAuditContent.stats.dormant, value: formatNumber(totals.dormant), tone: "warning", info: UsersAuditContent.tileInfo.dormant }),
                React.createElement(StatTile, { iconName: "Admin", label: UsersAuditContent.stats.admins, value: formatNumber(totals.siteAdmins), tone: "warning", info: UsersAuditContent.tileInfo.admins }))),
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "Groups"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "Group", label: UsersAuditContent.stats.groups, value: formatNumber(totals.groups), unavailable: !(config.readGroups), info: UsersAuditContent.tileInfo.groups }),
                React.createElement(StatTile, { iconName: "UserOptional", label: UsersAuditContent.stats.ungrouped, value: formatNumber(totals.usersWithoutGroup), unavailable: !(config.readGroups), tone: "warning", info: UsersAuditContent.tileInfo.ungrouped }),
                React.createElement(StatTile, { iconName: "Calculator", label: UsersAuditContent.stats.average, value: String(totals.averageGroupSize), unavailable: !(config.readGroups), info: UsersAuditContent.tileInfo.average }))),
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "Profiles"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "ContactCard", label: UsersAuditContent.stats.profiles, value: formatNumber(totals.profilesRead), unavailable: !(config.readProfiles), hint: config.readProfiles ? `${formatNumber(totals.withDepartment)} with a department` : undefined, info: UsersAuditContent.tileInfo.profiles }),
                React.createElement(StatTile, { iconName: "System", label: UsersAuditContent.stats.system, value: formatNumber(totals.system), info: UsersAuditContent.tileInfo.system })))));
};
//# sourceMappingURL=UsersAudit.stats.js.map