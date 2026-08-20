import { downloadCsv } from "../../utils/Export.util";
export function userRow(user) {
    var _a, _b;
    return {
        site: user.siteUrl,
        title: user.title,
        loginName: user.loginName,
        email: user.email,
        kind: user.kind,
        siteAdmin: user.isSiteAdmin,
        external: user.isExternal,
        system: user.isSystem,
        firstSeen: (_a = user.createdIso) !== null && _a !== void 0 ? _a : "",
        recordChanged: (_b = user.modifiedIso) !== null && _b !== void 0 ? _b : "",
    };
}
export function groupRow(group) {
    return {
        site: group.siteUrl,
        group: group.title,
        owner: group.ownerTitle,
        members: group.memberCount,
        memberLogins: group.members.map((member) => member.loginName).join("|"),
    };
}
export function profileRow(profile) {
    var _a;
    return {
        loginName: profile.loginName,
        displayName: profile.displayName,
        email: profile.email,
        department: profile.department,
        jobTitle: profile.jobTitle,
        office: profile.office,
        hasPicture: profile.hasPicture,
        propertyCount: profile.propertyCount,
        error: (_a = profile.error) !== null && _a !== void 0 ? _a : "",
    };
}
export function exportUsers(data) {
    var _a;
    downloadCsv("users-audit", ((_a = data === null || data === void 0 ? void 0 : data.users) !== null && _a !== void 0 ? _a : []).map(userRow));
}
export function exportGroups(data) {
    var _a;
    downloadCsv("users-groups", ((_a = data === null || data === void 0 ? void 0 : data.groups) !== null && _a !== void 0 ? _a : []).map(groupRow));
}
export function exportProfiles(data) {
    var _a;
    downloadCsv("users-profiles", ((_a = data === null || data === void 0 ? void 0 : data.profiles) !== null && _a !== void 0 ? _a : []).map(profileRow));
}
//# sourceMappingURL=UsersAudit.csv.js.map