import * as React from "react";
import { StatTile } from "../../components/layout/StatTile";
import { Theme } from "../../theme/Theme.api";
import { PermissionsAuditContent } from "./PermissionsAudit.content";
import { formatNumber } from "../../utils/Format.util";
export const PermissionsAuditStats = ({ view, config }) => {
    const { totals } = view;
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 } },
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "Groups and levels"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "Group", label: PermissionsAuditContent.stats.groups, value: formatNumber(totals.groups), info: PermissionsAuditContent.tileInfo.groups }),
                React.createElement(StatTile, { iconName: "People", label: PermissionsAuditContent.stats.members, value: formatNumber(totals.members), unavailable: !(config.readGroupMembers), info: PermissionsAuditContent.tileInfo.members }),
                React.createElement(StatTile, { iconName: "FieldEmpty", label: PermissionsAuditContent.stats.empty, value: formatNumber(totals.emptyGroups), unavailable: !(config.readGroupMembers), info: PermissionsAuditContent.tileInfo.empty }),
                React.createElement(StatTile, { iconName: "Permissions", label: PermissionsAuditContent.stats.levels, value: formatNumber(totals.levels), hint: `${formatNumber(totals.customLevels)} custom`, info: PermissionsAuditContent.tileInfo.levels }))),
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "Grants"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "Permissions", label: PermissionsAuditContent.stats.grants, value: formatNumber(totals.grants), info: PermissionsAuditContent.tileInfo.grants }),
                React.createElement(StatTile, { iconName: "UserOptional", label: PermissionsAuditContent.stats.direct, value: formatNumber(totals.directUserGrants), tone: "warning", badge: totals.directUserGrants > 0 ? PermissionsAuditContent.review : undefined, info: PermissionsAuditContent.tileInfo.direct }),
                React.createElement(StatTile, { iconName: "People", label: PermissionsAuditContent.stats.everyone, value: formatNumber(totals.everyoneGrants), tone: "warning", info: PermissionsAuditContent.tileInfo.everyone }),
                React.createElement(StatTile, { iconName: "Permissions", label: PermissionsAuditContent.stats.fullControl, value: formatNumber(totals.fullControlGrants), tone: "warning", info: PermissionsAuditContent.tileInfo.fullControl }))),
        React.createElement("section", { style: { width: "100%", minWidth: 0 } },
            React.createElement("h3", { style: {
                    margin: `0 0 ${Theme.tokens.space.sm}`,
                    fontSize: Theme.tokens.font.md,
                    color: Theme.palette().textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                } }, "Inheritance and sharing"),
            React.createElement("div", { style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: Theme.tokens.space.md,
                    width: "100%",
                    minWidth: 0,
                } },
                React.createElement(StatTile, { iconName: "BranchFork2", label: PermissionsAuditContent.stats.unique, value: formatNumber(totals.uniqueLists), info: PermissionsAuditContent.tileInfo.unique }),
                React.createElement(StatTile, { iconName: "BranchFork2", label: PermissionsAuditContent.stats.itemBreaks, value: formatNumber(totals.itemBreaks), unavailable: !(config.checkItemBreaks), hint: config.checkItemBreaks ? `${formatNumber(totals.itemsChecked)} sampled` : undefined, info: PermissionsAuditContent.tileInfo.itemBreaks }),
                React.createElement(StatTile, { iconName: "Share", label: PermissionsAuditContent.stats.sharing, value: formatNumber(totals.sharingLinks), info: PermissionsAuditContent.tileInfo.sharing }),
                React.createElement(StatTile, { iconName: "Globe", label: PermissionsAuditContent.stats.external, value: formatNumber(totals.externalPrincipals), tone: "warning", badge: totals.externalPrincipals > 0 ? PermissionsAuditContent.review : undefined, info: PermissionsAuditContent.tileInfo.external })))));
};
//# sourceMappingURL=PermissionsAudit.stats.js.map