import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { IconButton } from "../../components/actions/IconButton";
import { Theme } from "../../theme/Theme.api";
import { SiteLists } from "../../api/Lists.api";
import { PermissionsAuditContent } from "./PermissionsAudit.content";
import { hasFullControl, kindLabel } from "./PermissionsAudit.logic";
import { formatNumber } from "../../utils/Format.util";
export function groupColumns(onSelect) {
    return [
        {
            key: "title",
            header: PermissionsAuditContent.columns.group,
            minWidth: 260,
            maxWidth: 360,
            sortValue: (group) => group.title,
            render: (group) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, group.title),
                group.description && (React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, group.description)))),
        },
        {
            key: "owner",
            header: PermissionsAuditContent.columns.owner,
            minWidth: 180,
            sortValue: (group) => group.ownerTitle,
            render: (group) => React.createElement("span", null, group.ownerTitle || "-"),
        },
        {
            key: "members",
            header: PermissionsAuditContent.columns.members,
            minWidth: 110,
            sortValue: (group) => group.memberCount,
            render: (group) => React.createElement("span", null, formatNumber(group.memberCount)),
        },
        {
            key: "membership",
            header: PermissionsAuditContent.columns.membership,
            minWidth: 220,
            sortValue: (group) => (group.allowMembersEditMembership ? 1 : 0),
            filterValue: (group) => group.allowMembersEditMembership
                ? PermissionsAuditContent.membershipOpen
                : PermissionsAuditContent.membershipClosed,
            render: (group) => (React.createElement(Badge, { label: group.allowMembersEditMembership
                    ? PermissionsAuditContent.membershipOpen
                    : PermissionsAuditContent.membershipClosed, tone: group.allowMembersEditMembership ? "warning" : "neutral", showIcon: false })),
        },
        {
            key: "flags",
            header: PermissionsAuditContent.columns.flags,
            minWidth: 150,
            filterValue: (group) => (group.isSharingLink ? PermissionsAuditContent.flags.sharing : "Standard"),
            render: (group) => group.isSharingLink ? (React.createElement(Badge, { label: PermissionsAuditContent.flags.sharing, tone: "info", showIcon: false })) : (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")),
        },
        {
            key: "actions",
            header: PermissionsAuditContent.columns.actions,
            minWidth: 100,
            render: (group) => (React.createElement(IconButton, { iconName: "Info", ariaLabel: `Details: ${group.title}`, tooltip: "Details", onClick: () => onSelect(group) })),
        },
    ];
}
export const levelColumns = [
    {
        key: "name",
        header: PermissionsAuditContent.columns.level,
        minWidth: 220,
        sortValue: (level) => level.name,
        render: (level) => React.createElement("span", { style: { fontWeight: 600 } }, level.name),
    },
    {
        key: "type",
        header: PermissionsAuditContent.columns.type,
        minWidth: 140,
        sortValue: (level) => (level.isCustom ? 0 : 1),
        filterValue: (level) => (level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn),
        render: (level) => (React.createElement(Badge, { label: level.isCustom ? PermissionsAuditContent.columns.custom : PermissionsAuditContent.columns.builtIn, tone: level.isCustom ? "warning" : "neutral" })),
    },
    {
        key: "rights",
        header: PermissionsAuditContent.level.rights,
        minWidth: 320,
        maxWidth: 520,
        sortValue: (level) => { var _a; return ((_a = level.permissions) !== null && _a !== void 0 ? _a : []).length; },
        render: (level) => {
            var _a, _b, _c;
            return (React.createElement("span", { style: { color: Theme.palette().textMuted } },
                ((_a = level.permissions) !== null && _a !== void 0 ? _a : []).slice(0, 4).join(", ") || "-",
                ((_b = level.permissions) !== null && _b !== void 0 ? _b : []).length > 4 ? ` +${((_c = level.permissions) !== null && _c !== void 0 ? _c : []).length - 4}` : ""));
        },
    },
    {
        key: "description",
        header: PermissionsAuditContent.columns.description,
        minWidth: 320,
        maxWidth: 520,
        sortValue: (level) => level.description,
        render: (level) => React.createElement("span", { style: { color: Theme.palette().textMuted } }, level.description || "-"),
    },
];
export const grantColumns = [
    {
        key: "principal",
        header: PermissionsAuditContent.columns.principal,
        minWidth: 260,
        maxWidth: 360,
        sortValue: (grant) => grant.principalTitle,
        filterValue: (grant) => grant.principalTitle,
        render: (grant) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, grant.principalTitle),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, grant.loginName))),
    },
    {
        key: "kind",
        header: PermissionsAuditContent.columns.kind,
        minWidth: 160,
        sortValue: (grant) => kindLabel(grant.kind),
        filterValue: (grant) => kindLabel(grant.kind),
        render: (grant) => (React.createElement(Badge, { label: kindLabel(grant.kind), tone: grant.kind === "user" ? "warning" : "neutral", showIcon: false })),
    },
    {
        key: "scope",
        header: PermissionsAuditContent.columns.scope,
        minWidth: 200,
        maxWidth: 280,
        sortValue: (grant) => grant.scopeTitle,
        filterValue: (grant) => grant.scopeTitle,
        render: (grant) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, grant.scopeTitle),
            React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, PermissionsAuditContent.scope[grant.scope]))),
    },
    {
        key: "scopeType",
        header: PermissionsAuditContent.columns.scopeType,
        minWidth: 130,
        sortValue: (grant) => grant.scope,
        filterValue: (grant) => PermissionsAuditContent.scope[grant.scope],
        render: (grant) => React.createElement(Badge, { label: PermissionsAuditContent.scope[grant.scope], tone: "neutral", showIcon: false }),
    },
    {
        key: "roles",
        header: PermissionsAuditContent.columns.roles,
        minWidth: 240,
        maxWidth: 340,
        sortValue: (grant) => grant.roles.join(", "),
        filterValue: (grant) => { var _a; return (_a = grant.roles[0]) !== null && _a !== void 0 ? _a : "-"; },
        render: (grant) => React.createElement("span", null, grant.roles.join(", ") || "-"),
    },
    {
        key: "flags",
        header: PermissionsAuditContent.columns.flags,
        minWidth: 220,
        filterValue: (grant) => { var _a; return (_a = flagsOf(grant)[0]) !== null && _a !== void 0 ? _a : "Standard"; },
        render: (grant) => {
            const flags = flagsOf(grant);
            return flags.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, flags.map((flag) => (React.createElement(Badge, { key: flag, label: flag, tone: "warning", showIcon: false })))));
        },
    },
];
export function flagsOf(grant) {
    const flags = [];
    if (grant.isEveryone)
        flags.push(PermissionsAuditContent.flags.everyone);
    if (grant.isExternal)
        flags.push(PermissionsAuditContent.flags.external);
    if (grant.isSharingLink)
        flags.push(PermissionsAuditContent.flags.sharing);
    if (hasFullControl(grant))
        flags.push(PermissionsAuditContent.flags.fullControl);
    return flags;
}
export const scopeColumns = [
    {
        key: "title",
        header: PermissionsAuditContent.columns.list,
        minWidth: 280,
        maxWidth: 380,
        sortValue: (scope) => scope.title,
        render: (scope) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, scope.title),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, scope.url))),
    },
    {
        key: "template",
        header: PermissionsAuditContent.columns.template,
        minWidth: 160,
        sortValue: (scope) => scope.templateName,
        filterValue: (scope) => scope.templateName,
        render: (scope) => React.createElement(Badge, { label: scope.templateName, tone: "neutral", showIcon: false }),
    },
    {
        key: "items",
        header: PermissionsAuditContent.columns.items,
        minWidth: 110,
        sortValue: (scope) => scope.itemCount,
        render: (scope) => React.createElement("span", null, formatNumber(scope.itemCount)),
    },
    {
        key: "sampled",
        header: PermissionsAuditContent.columns.sampled,
        minWidth: 120,
        sortValue: (scope) => { var _a; return (_a = scope.itemsChecked) !== null && _a !== void 0 ? _a : -1; },
        render: (scope) => React.createElement("span", null, scope.itemsChecked === undefined ? "-" : formatNumber(scope.itemsChecked)),
    },
    {
        key: "broken",
        header: PermissionsAuditContent.columns.broken,
        minWidth: 220,
        sortValue: (scope) => { var _a; return (_a = scope.itemsWithUniquePermissions) !== null && _a !== void 0 ? _a : -1; },
        render: (scope) => scope.itemsWithUniquePermissions === undefined ? (React.createElement("span", null, "-")) : (React.createElement(Badge, { label: formatNumber(scope.itemsWithUniquePermissions), tone: scope.itemsWithUniquePermissions > 0 ? "warning" : "success", showIcon: false })),
    },
    {
        key: "actions",
        header: PermissionsAuditContent.columns.actions,
        minWidth: 110,
        render: (scope) => (React.createElement(IconButton, { iconName: "Permissions", ariaLabel: `${PermissionsAuditContent.openPermissions}: ${scope.title}`, tooltip: PermissionsAuditContent.openPermissions, onClick: () => window.open(SiteLists(scope.siteUrl).permissionsUrl({ id: scope.listId }), "_blank", "noopener") })),
    },
];
//# sourceMappingURL=PermissionsAudit.columns.js.map