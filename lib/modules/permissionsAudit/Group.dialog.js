import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { Table } from "../../components/data/Table";
import { Theme } from "../../theme/Theme.api";
import { PermissionsAuditContent } from "./PermissionsAudit.content";
import { kindLabel } from "./PermissionsAudit.logic";
import { formatNumber } from "../../utils/Format.util";
const memberColumns = [
    {
        key: "title",
        header: "Member",
        minWidth: 240,
        sortValue: (member) => member.title,
        render: (member) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600 } }, member.title),
            React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, member.loginName))),
    },
    {
        key: "kind",
        header: PermissionsAuditContent.columns.kind,
        minWidth: 160,
        sortValue: (member) => kindLabel(member.kind),
        filterValue: (member) => kindLabel(member.kind),
        render: (member) => React.createElement(Badge, { label: kindLabel(member.kind), tone: "neutral", showIcon: false }),
    },
    {
        key: "flags",
        header: PermissionsAuditContent.columns.flags,
        minWidth: 180,
        filterValue: (member) => member.isExternal
            ? PermissionsAuditContent.flags.external
            : member.isSiteAdmin
                ? PermissionsAuditContent.flags.siteAdmin
                : "Standard",
        render: (member) => (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
            member.isExternal && React.createElement(Badge, { label: PermissionsAuditContent.flags.external, tone: "warning", showIcon: false }),
            member.isSiteAdmin && React.createElement(Badge, { label: PermissionsAuditContent.flags.siteAdmin, tone: "danger", showIcon: false }),
            !member.isExternal && !member.isSiteAdmin && React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-"))),
    },
];
export const GroupDialog = ({ group, grants, onDismiss }) => {
    var _a;
    if (!group)
        return null;
    const groupGrants = grants.filter((grant) => grant.principalTitle === group.title);
    return (React.createElement(PreviewDialog, { open: Boolean(group), onDismiss: onDismiss, title: group.title, description: group.description || undefined, facts: [
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
            { label: "Login name", value: React.createElement("code", null, group.loginName || "-") },
        ], actions: React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss }), sections: [
            {
                key: "members",
                title: PermissionsAuditContent.columns.members,
                content: group.members.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, (_a = group.error) !== null && _a !== void 0 ? _a : "No members, or membership was not read for this run.")) : (React.createElement(Table, { ariaLabel: `${group.title} members`, rows: group.members, columns: memberColumns, getRowKey: (member) => member.loginName, searchValue: (member) => `${member.title} ${member.loginName} ${member.email}`, searchLabel: "Search members", maxHeight: 360 })),
            },
            {
                key: "grants",
                title: PermissionsAuditContent.columns.scope,
                content: groupGrants.length === 0 ? (React.createElement("p", { style: { margin: 0, color: Theme.palette().textMuted } }, "This group holds no role assignments in the scopes that were read.")) : (React.createElement("ul", { style: { margin: 0, paddingLeft: Theme.tokens.space.lg } }, groupGrants.map((grant) => (React.createElement("li", { key: `${grant.scope}-${grant.scopeUrl}` },
                    grant.scopeTitle,
                    " (",
                    PermissionsAuditContent.scope[grant.scope],
                    "): ",
                    grant.roles.join(", ")))))),
            },
        ] }));
};
//# sourceMappingURL=Group.dialog.js.map