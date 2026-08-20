import { __asyncValues, __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { toErrorMessage } from "../utils/Guard.util";
const ASSIGNMENT_SELECT = [
    "PrincipalId",
    "Member/Id",
    "Member/Title",
    "Member/LoginName",
    "Member/PrincipalType",
    "RoleDefinitionBindings/Name",
    "RoleDefinitionBindings/Hidden",
];
export function SitePermissions(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        levels() {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.roleDefinitions.select("Id", "Name", "Description", "Order", "RoleTypeKind", "Hidden", "BasePermissions")(), { label: "Permissions.levels" }));
                return rows.map((row) => {
                    var _a, _b, _c, _d;
                    return ({
                        id: row.Id,
                        name: row.Name,
                        description: (_a = row.Description) !== null && _a !== void 0 ? _a : "",
                        roleTypeKind: Number((_b = row.RoleTypeKind) !== null && _b !== void 0 ? _b : 0),
                        hidden: Boolean(row.Hidden),
                        order: Number((_c = row.Order) !== null && _c !== void 0 ? _c : 0),
                        isCustom: Number((_d = row.RoleTypeKind) !== null && _d !== void 0 ? _d : 0) === 0,
                        permissions: decodePermissions(row.BasePermissions),
                    });
                });
            });
        },
        groups(withMembers) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.siteGroups.select("Id", "Title", "Description", "OwnerTitle", "LoginName", "AllowMembersEditMembership", "OnlyAllowMembersViewMembership")(), { label: "Permissions.groups" }));
                const groups = rows.map((row) => {
                    var _a, _b, _c, _d;
                    return ({
                        siteUrl: site,
                        id: row.Id,
                        title: row.Title,
                        description: (_a = row.Description) !== null && _a !== void 0 ? _a : "",
                        ownerTitle: (_b = row.OwnerTitle) !== null && _b !== void 0 ? _b : "",
                        loginName: (_c = row.LoginName) !== null && _c !== void 0 ? _c : "",
                        allowMembersEditMembership: Boolean(row.AllowMembersEditMembership),
                        onlyAllowMembersViewMembership: Boolean(row.OnlyAllowMembersViewMembership),
                        isSharingLink: /^sharinglinks\./i.test((_d = row.Title) !== null && _d !== void 0 ? _d : ""),
                        memberCount: 0,
                        members: [],
                    });
                });
                if (!withMembers)
                    return groups;
                for (const group of groups) {
                    try {
                        const users = (yield throttled(() => getSp(webUrl)
                            .web.siteGroups.getById(group.id)
                            .users.select("Title", "LoginName", "Email", "PrincipalType", "IsSiteAdmin")(), { label: "Permissions.groupUsers" }));
                        group.members = users.map(toMember);
                        group.memberCount = users.length;
                    }
                    catch (error) {
                        group.error = toErrorMessage(error);
                    }
                }
                return groups;
            });
        },
        webGrants(siteTitle) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl).web.roleAssignments.select(...ASSIGNMENT_SELECT).expand("Member", "RoleDefinitionBindings")(), { label: "Permissions.webGrants" }));
                return rows.map((row) => toGrant(row, site, "web", siteTitle, site));
            });
        },
        listGrants(list) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .roleAssignments.select(...ASSIGNMENT_SELECT)
                    .expand("Member", "RoleDefinitionBindings")(), { label: "Permissions.listGrants" }));
                return rows.map((row) => toGrant(row, site, "list", list.title, list.serverRelativeUrl));
            });
        },
        /** Pages the list rather than taking one page, so a whole list can be checked. */
        itemsWithUniquePermissions(list, maxItems) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                var _d, _e;
                const items = [];
                let checked = 0;
                let unique = 0;
                const query = getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.select("Id", "Title", "FileRef", "HasUniqueRoleAssignments")
                    .top(Math.min(2000, Math.max(1, maxItems)));
                try {
                    for (var _f = true, query_1 = __asyncValues(query), query_1_1; query_1_1 = yield query_1.next(), _a = query_1_1.done, !_a; _f = true) {
                        _c = query_1_1.value;
                        _f = false;
                        const page = _c;
                        for (const row of page) {
                            if (checked >= maxItems) {
                                return { checked, unique, items };
                            }
                            checked = checked + 1;
                            if (!row.HasUniqueRoleAssignments)
                                continue;
                            unique = unique + 1;
                            if (items.length < 500) {
                                items.push({
                                    siteUrl: site,
                                    listTitle: list.title,
                                    itemId: row.Id,
                                    title: row.Title || ((_d = row.FileRef) === null || _d === void 0 ? void 0 : _d.split("/").pop()) || String(row.Id),
                                    url: (_e = row.FileRef) !== null && _e !== void 0 ? _e : "",
                                });
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_f && !_a && (_b = query_1.return)) yield _b.call(query_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return { checked, unique, items };
            });
        },
    };
}
function toGrant(row, siteUrl, scope, scopeTitle, scopeUrl) {
    var _a, _b, _c, _d, _e, _f;
    const loginName = (_b = (_a = row.Member) === null || _a === void 0 ? void 0 : _a.LoginName) !== null && _b !== void 0 ? _b : "";
    const title = (_d = (_c = row.Member) === null || _c === void 0 ? void 0 : _c.Title) !== null && _d !== void 0 ? _d : "";
    return {
        siteUrl,
        scope,
        scopeTitle,
        scopeUrl,
        principalId: row.PrincipalId,
        principalTitle: title,
        loginName,
        kind: kindOf((_e = row.Member) === null || _e === void 0 ? void 0 : _e.PrincipalType),
        isExternal: isExternal(loginName),
        isEveryone: isEveryone(loginName, title),
        isSharingLink: /^sharinglinks\./i.test(title),
        roles: ((_f = row.RoleDefinitionBindings) !== null && _f !== void 0 ? _f : []).filter((role) => !role.Hidden).map((role) => role.Name),
    };
}
function toMember(row) {
    var _a;
    return {
        title: row.Title,
        loginName: row.LoginName,
        email: (_a = row.Email) !== null && _a !== void 0 ? _a : "",
        kind: kindOf(row.PrincipalType),
        isExternal: isExternal(row.LoginName),
        isSiteAdmin: Boolean(row.IsSiteAdmin),
    };
}
/** SharePoint rights, by bit position in the permission mask. */
const RIGHTS = [
    { bit: 1, name: "View list items" },
    { bit: 2, name: "Add list items" },
    { bit: 3, name: "Edit list items" },
    { bit: 4, name: "Delete list items" },
    { bit: 5, name: "Approve items" },
    { bit: 6, name: "Open items" },
    { bit: 7, name: "View versions" },
    { bit: 8, name: "Delete versions" },
    { bit: 9, name: "Override check out" },
    { bit: 10, name: "Manage personal views" },
    { bit: 12, name: "Manage lists" },
    { bit: 13, name: "View form pages" },
    { bit: 14, name: "Anonymous search access list" },
    { bit: 17, name: "Open web" },
    { bit: 18, name: "View pages" },
    { bit: 19, name: "Add and customise pages" },
    { bit: 20, name: "Apply theme and border" },
    { bit: 21, name: "Apply style sheets" },
    { bit: 22, name: "View usage data" },
    { bit: 23, name: "Create site collection" },
    { bit: 24, name: "Manage subwebs" },
    { bit: 25, name: "Create groups" },
    { bit: 26, name: "Manage permissions" },
    { bit: 27, name: "Browse directories" },
    { bit: 28, name: "Browse user info" },
    { bit: 29, name: "Add and remove personal web parts" },
    { bit: 30, name: "Use remote interfaces" },
    { bit: 31, name: "Use client integration" },
    { bit: 32, name: "Open" },
    { bit: 33, name: "Edit personal user information" },
    { bit: 34, name: "Manage alerts" },
    { bit: 35, name: "Create alerts" },
    { bit: 37, name: "Enumerate permissions" },
];
function decodePermissions(mask) {
    var _a, _b;
    if (!mask)
        return [];
    const high = Number((_a = mask.High) !== null && _a !== void 0 ? _a : 0);
    const low = Number((_b = mask.Low) !== null && _b !== void 0 ? _b : 0);
    if ((high & 32767) === 32767 && low === 65535)
        return ["Full control"];
    return RIGHTS.filter((right) => {
        const bit = 1 << ((right.bit - 1) % 32);
        return right.bit <= 32 ? (low & bit) !== 0 : (high & bit) !== 0;
    }).map((right) => right.name);
}
function kindOf(principalType) {
    if (principalType === 1)
        return "user";
    if (principalType === 2)
        return "distributionList";
    if (principalType === 4)
        return "securityGroup";
    if (principalType === 8)
        return "sharePointGroup";
    return "other";
}
function isExternal(loginName) {
    return /#ext#|urn:spo:guest/i.test(loginName);
}
function isEveryone(loginName, title) {
    return /spo-grid-all-users|c:0\(\.s\|true|everyone/i.test(`${loginName} ${title}`);
}
//# sourceMappingURL=SitePermissions.api.js.map