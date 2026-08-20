import { __awaiter } from "tslib";
import { getSp, getContext } from "./Sp.api";
import { throttled } from "./Throttle.api";
const OWNER_GROUP_PATTERN = /owners$/i;
const MANAGE_WEB_MASK = 0x40000000;
export function Permissions(webUrl) {
    return {
        currentUser() {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield throttled(() => getSp(webUrl).web.currentUser(), { priority: true });
                return {
                    id: user.Id,
                    title: user.Title,
                    email: user.Email,
                    loginName: user.LoginName,
                    isSiteAdmin: Boolean(user.IsSiteAdmin),
                };
            });
        },
        /** Site collection admin, owners group, or ManageWeb. */
        accessProfile() {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.currentUser();
                if (user.isSiteAdmin)
                    return { user, isAdmin: true, groups: [] };
                const groups = yield throttled(() => getSp(webUrl).web.currentUser.groups(), { priority: true });
                const titles = groups.map((group) => group.Title);
                return {
                    user,
                    isAdmin: titles.some((title) => OWNER_GROUP_PATTERN.test(title)) || this.hasManageWeb(),
                    groups: titles,
                };
            });
        },
        hasManageWeb() {
            var _a, _b;
            const legacy = getContext().pageContext.legacyPageContext;
            return (((_b = (_a = legacy === null || legacy === void 0 ? void 0 : legacy.webPermMasks) === null || _a === void 0 ? void 0 : _a.High) !== null && _b !== void 0 ? _b : 0) & MANAGE_WEB_MASK) !== 0;
        },
    };
}
//# sourceMappingURL=Permissions.api.js.map