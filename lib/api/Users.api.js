import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { toErrorMessage } from "../utils/Guard.util";
const SYSTEM_PATTERN = /app@sharepoint|system account|sharepoint app|c:0\(\.s\|true|spocrawler|_spocrawler/i;
export function SiteUsers(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        all() {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.siteUsers.select("Id", "Title", "LoginName", "Email", "PrincipalType", "IsSiteAdmin")(), { label: "Users.all" }));
                return rows.map((row) => {
                    var _a, _b;
                    return ({
                        siteUrl: site,
                        id: row.Id,
                        title: row.Title,
                        loginName: row.LoginName,
                        email: (_a = row.Email) !== null && _a !== void 0 ? _a : "",
                        kind: kindOf(row.PrincipalType),
                        isSiteAdmin: Boolean(row.IsSiteAdmin),
                        isExternal: /#ext#|urn:spo:guest/i.test((_b = row.LoginName) !== null && _b !== void 0 ? _b : ""),
                        isSystem: SYSTEM_PATTERN.test(`${row.LoginName} ${row.Title}`),
                    });
                });
            });
        },
        /** The user information list is where the created and modified dates live. */
        withInfoList(users) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.siteUserInfoList.items.select("Id", "Title", "Name", "EMail", "Created", "Modified")
                    .top(5000)(), { label: "Users.infoList" }));
                const byId = new Map(rows.map((row) => [row.Id, row]));
                return users.map((user) => {
                    const info = byId.get(user.id);
                    return info
                        ? Object.assign(Object.assign({}, user), { createdIso: info.Created, modifiedIso: info.Modified }) : user;
                });
            });
        },
        profile(loginName) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                try {
                    const profile = yield throttled(() => getSp(webUrl).profiles.getPropertiesFor(loginName), {
                        label: "Users.profile",
                    });
                    const properties = readProperties(profile.UserProfileProperties);
                    return {
                        loginName,
                        displayName: String((_a = profile.DisplayName) !== null && _a !== void 0 ? _a : ""),
                        email: String((_c = (_b = profile.Email) !== null && _b !== void 0 ? _b : properties.WorkEmail) !== null && _c !== void 0 ? _c : ""),
                        department: (_e = (_d = properties.Department) !== null && _d !== void 0 ? _d : properties["SPS-Department"]) !== null && _e !== void 0 ? _e : "",
                        jobTitle: (_g = (_f = properties.Title) !== null && _f !== void 0 ? _f : properties["SPS-JobTitle"]) !== null && _g !== void 0 ? _g : "",
                        office: (_j = (_h = properties.Office) !== null && _h !== void 0 ? _h : properties["SPS-Location"]) !== null && _j !== void 0 ? _j : "",
                        hasPicture: Boolean(profile.PictureUrl),
                        propertyCount: Object.keys(properties).filter((key) => properties[key]).length,
                    };
                }
                catch (error) {
                    return {
                        loginName,
                        displayName: "",
                        email: "",
                        department: "",
                        jobTitle: "",
                        office: "",
                        hasPicture: false,
                        propertyCount: 0,
                        error: toErrorMessage(error),
                    };
                }
            });
        },
    };
}
function readProperties(raw) {
    var _a;
    const entries = (_a = raw) !== null && _a !== void 0 ? _a : [];
    const properties = {};
    entries.forEach((entry) => {
        var _a;
        if (entry.Key)
            properties[entry.Key] = String((_a = entry.Value) !== null && _a !== void 0 ? _a : "");
    });
    return properties;
}
function kindOf(principalType) {
    if (principalType === 1)
        return "user";
    if (principalType === 4)
        return "securityGroup";
    if (principalType === 8)
        return "sharePointGroup";
    return "other";
}
//# sourceMappingURL=Users.api.js.map