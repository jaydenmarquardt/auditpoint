import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { UsersAuditContent } from "./UsersAudit.content";
import { isDormant, kindLabel } from "./UsersAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
export function userColumns(recentDays, groupsFor) {
    return [
        {
            key: "title",
            header: UsersAuditContent.columns.user,
            minWidth: 260,
            maxWidth: 360,
            sortValue: (user) => user.title,
            render: (user) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, user.title),
                React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, user.loginName))),
        },
        {
            key: "kind",
            header: UsersAuditContent.columns.kind,
            minWidth: 160,
            sortValue: (user) => kindLabel(user.kind),
            filterValue: (user) => kindLabel(user.kind),
            render: (user) => React.createElement(Badge, { label: kindLabel(user.kind), tone: "neutral", showIcon: false }),
        },
        {
            key: "email",
            header: UsersAuditContent.columns.email,
            minWidth: 240,
            sortValue: (user) => user.email,
            render: (user) => React.createElement("span", null, user.email || "-"),
        },
        {
            key: "created",
            header: UsersAuditContent.columns.created,
            minWidth: 150,
            sortValue: (user) => { var _a; return (_a = user.createdIso) !== null && _a !== void 0 ? _a : ""; },
            render: (user) => React.createElement("span", null, user.createdIso ? formatDate(user.createdIso) : "-"),
        },
        {
            key: "modified",
            header: UsersAuditContent.columns.modified,
            minWidth: 160,
            sortValue: (user) => { var _a; return (_a = user.modifiedIso) !== null && _a !== void 0 ? _a : ""; },
            render: (user) => React.createElement("span", null, user.modifiedIso ? formatDate(user.modifiedIso) : "-"),
        },
        {
            key: "groups",
            header: UsersAuditContent.columns.groups,
            minWidth: 220,
            maxWidth: 320,
            sortValue: (user) => groupsFor(user).length,
            render: (user) => (React.createElement("span", { style: { color: Theme.palette().textMuted } }, groupsFor(user).join(", ") || "-")),
        },
        {
            key: "flags",
            header: UsersAuditContent.columns.flags,
            minWidth: 220,
            filterValue: (user) => { var _a; return (_a = userFlags(user, recentDays)[0]) !== null && _a !== void 0 ? _a : "Standard"; },
            render: (user) => {
                const flags = userFlags(user, recentDays);
                return flags.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, flags.map((flag) => (React.createElement(Badge, { key: flag, label: flag, tone: flag === UsersAuditContent.flags.system ? "neutral" : "warning", showIcon: false })))));
            },
        },
    ];
}
export function userFlags(user, recentDays) {
    const flags = [];
    if (user.isExternal)
        flags.push(UsersAuditContent.flags.external);
    if (user.isSiteAdmin)
        flags.push(UsersAuditContent.flags.admin);
    if (user.isSystem)
        flags.push(UsersAuditContent.flags.system);
    if (user.kind === "user" && isDormant(user, recentDays))
        flags.push(UsersAuditContent.flags.dormant);
    return flags;
}
export function groupSettingsUrl(group) {
    var _a;
    const site = ((_a = group.siteUrl) !== null && _a !== void 0 ? _a : "").replace(/\/$/, "");
    return `${site}/_layouts/15/people.aspx?MembershipGroupId=${group.id}`;
}
export const groupColumns = [
    {
        key: "title",
        header: UsersAuditContent.columns.group,
        minWidth: 280,
        sortValue: (group) => group.title,
        render: (group) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600 } }, group.title),
            group.description && (React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, group.description)))),
    },
    {
        key: "owner",
        header: UsersAuditContent.columns.owner,
        minWidth: 200,
        sortValue: (group) => group.ownerTitle,
        render: (group) => React.createElement("span", null, group.ownerTitle || "-"),
    },
    {
        key: "members",
        header: UsersAuditContent.columns.members,
        minWidth: 120,
        sortValue: (group) => group.memberCount,
        render: (group) => React.createElement("span", null, formatNumber(group.memberCount)),
    },
];
export const profileColumns = [
    {
        key: "displayName",
        header: UsersAuditContent.columns.user,
        minWidth: 260,
        sortValue: (profile) => profile.displayName || profile.loginName,
        render: (profile) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600 } }, profile.displayName || profile.loginName),
            React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, profile.email || "-"))),
    },
    {
        key: "department",
        header: UsersAuditContent.columns.department,
        minWidth: 200,
        sortValue: (profile) => profile.department,
        filterValue: (profile) => profile.department || "-",
        render: (profile) => React.createElement("span", null, profile.department || "-"),
    },
    {
        key: "jobTitle",
        header: UsersAuditContent.columns.jobTitle,
        minWidth: 220,
        sortValue: (profile) => profile.jobTitle,
        render: (profile) => React.createElement("span", null, profile.jobTitle || "-"),
    },
    {
        key: "office",
        header: UsersAuditContent.columns.office,
        minWidth: 180,
        sortValue: (profile) => profile.office,
        filterValue: (profile) => profile.office || "-",
        render: (profile) => React.createElement("span", null, profile.office || "-"),
    },
    {
        key: "photo",
        header: UsersAuditContent.columns.photo,
        minWidth: 110,
        sortValue: (profile) => (profile.hasPicture ? 1 : 0),
        filterValue: (profile) => (profile.hasPicture ? UsersAuditContent.yes : UsersAuditContent.no),
        render: (profile) => (React.createElement(Badge, { label: profile.hasPicture ? UsersAuditContent.yes : UsersAuditContent.no, tone: profile.hasPicture ? "success" : "neutral", showIcon: false })),
    },
    {
        key: "properties",
        header: UsersAuditContent.columns.properties,
        minWidth: 150,
        sortValue: (profile) => profile.propertyCount,
        render: (profile) => React.createElement("span", null, formatNumber(profile.propertyCount)),
    },
];
//# sourceMappingURL=UsersAudit.columns.js.map