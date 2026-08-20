import { PermissionsAuditContent } from "./PermissionsAudit.content";
export function kindLabel(kind) {
    return PermissionsAuditContent.kinds[kind === "other" ? "other" : kind];
}
export function hasFullControl(grant) {
    return grant.roles.some((role) => /full control/i.test(role));
}
export function buildView(data) {
    var _a, _b, _c, _d, _e;
    const groups = (_a = data === null || data === void 0 ? void 0 : data.groups) !== null && _a !== void 0 ? _a : [];
    const levels = (_b = data === null || data === void 0 ? void 0 : data.levels) !== null && _b !== void 0 ? _b : [];
    const grants = (_c = data === null || data === void 0 ? void 0 : data.grants) !== null && _c !== void 0 ? _c : [];
    const scopes = (_d = data === null || data === void 0 ? void 0 : data.scopes) !== null && _d !== void 0 ? _d : [];
    const directGrants = grants.filter((grant) => grant.kind === "user");
    const externals = new Set([
        ...grants.filter((grant) => grant.isExternal).map((grant) => grant.loginName),
        ...groups.flatMap((group) => group.members.filter((member) => member.isExternal).map((member) => member.loginName)),
    ].filter(Boolean));
    const totals = {
        groups: groups.length,
        members: groups.reduce((sum, group) => sum + group.memberCount, 0),
        emptyGroups: groups.filter((group) => !group.isSharingLink && group.memberCount === 0).length,
        levels: levels.length,
        customLevels: levels.filter((level) => level.isCustom).length,
        grants: grants.length,
        directUserGrants: directGrants.length,
        groupGrants: grants.filter((grant) => grant.kind !== "user").length,
        externalPrincipals: externals.size,
        everyoneGrants: grants.filter((grant) => grant.isEveryone).length,
        sharingLinks: groups.filter((group) => group.isSharingLink).length,
        lists: (_e = data === null || data === void 0 ? void 0 : data.listCount) !== null && _e !== void 0 ? _e : 0,
        uniqueLists: scopes.length,
        itemsChecked: scopes.reduce((sum, scope) => { var _a; return sum + ((_a = scope.itemsChecked) !== null && _a !== void 0 ? _a : 0); }, 0),
        itemBreaks: scopes.reduce((sum, scope) => { var _a; return sum + ((_a = scope.itemsWithUniquePermissions) !== null && _a !== void 0 ? _a : 0); }, 0),
        fullControlGrants: grants.filter(hasFullControl).length,
    };
    return {
        totals,
        grantsByKind: countBy(grants.map((grant) => kindLabel(grant.kind))),
        grantsByLevel: countBy(grants.flatMap((grant) => grant.roles)),
        membersByGroup: groups
            .filter((group) => !group.isSharingLink)
            .map((group) => ({ label: group.title, value: group.memberCount }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 12),
        inheritanceSplit: [
            { label: "Inherits site permissions", value: Math.max(0, totals.lists - totals.uniqueLists) },
            { label: "Unique permissions", value: totals.uniqueLists },
        ],
        directGrants,
        riskyGrants: grants.filter((grant) => grant.isEveryone || grant.isExternal || hasFullControl(grant)),
    };
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
//# sourceMappingURL=PermissionsAudit.logic.js.map