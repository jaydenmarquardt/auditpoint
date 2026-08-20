import { flagsOf } from "./PermissionsAudit.columns";
import { downloadCsv } from "../../utils/Export.util";
export function grantRow(grant) {
    return {
        site: grant.siteUrl,
        scopeType: grant.scope,
        scope: grant.scopeTitle,
        scopeUrl: grant.scopeUrl,
        principal: grant.principalTitle,
        loginName: grant.loginName,
        kind: grant.kind,
        roles: grant.roles.join("|"),
        flags: flagsOf(grant).join("|"),
    };
}
export function groupRow(group) {
    return {
        site: group.siteUrl,
        group: group.title,
        owner: group.ownerTitle,
        members: group.memberCount,
        membersCanEditMembership: group.allowMembersEditMembership,
        sharingLink: group.isSharingLink,
        memberLogins: group.members.map((member) => member.loginName).join("|"),
    };
}
export function brokenItemRow(item) {
    return {
        site: item.siteUrl,
        list: item.listTitle,
        itemId: item.itemId,
        title: item.title,
        url: item.url,
    };
}
export function exportPermissionsAudit(data) {
    var _a;
    downloadCsv("permissions-grants", ((_a = data === null || data === void 0 ? void 0 : data.grants) !== null && _a !== void 0 ? _a : []).map(grantRow));
}
export function exportGroups(data) {
    var _a;
    downloadCsv("permissions-groups", ((_a = data === null || data === void 0 ? void 0 : data.groups) !== null && _a !== void 0 ? _a : []).map(groupRow));
}
export function exportBrokenItems(data) {
    var _a;
    downloadCsv("permissions-item-breaks", ((_a = data === null || data === void 0 ? void 0 : data.brokenItems) !== null && _a !== void 0 ? _a : []).map(brokenItemRow));
}
//# sourceMappingURL=PermissionsAudit.csv.js.map