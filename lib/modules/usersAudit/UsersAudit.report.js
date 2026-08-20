import { __awaiter } from "tslib";
import { SiteUsers } from "../../api/Users.api";
import { SitePermissions } from "../../api/SitePermissions.api";
import { toErrorMessage } from "../../utils/Guard.util";
export const USERS_AUDIT_KIND = "users-audit";
export const usersAuditReport = {
    kind: USERS_AUDIT_KIND,
    title: "Users and groups audit",
    description: "Reads the site user list with first seen and last changed dates, SharePoint groups and their members, and a sample of user profiles.",
    iconName: "People",
    version: "1.0.0",
    schemaVersion: 1,
    defaultConfig: {
        months: 12,
        includeSystemAccounts: false,
        readGroups: true,
        readProfiles: true,
        profileSample: 5000,
        recentDays: 90,
    },
    configFields: [
        {
            key: "months",
            label: "Timeframe (months)",
            type: "number",
            min: 1,
            max: 60,
            step: 1,
            description: "How far back the added and changed charts run.",
        },
        {
            key: "recentDays",
            label: "Recent window (days)",
            type: "number",
            min: 7,
            max: 365,
            step: 7,
            description: "A person counts as active when their site record changed inside this window.",
        },
        {
            key: "includeSystemAccounts",
            label: "Include system accounts",
            type: "toggle",
            description: "Keeps app and service identities in the counts. Off gives a cleaner people number.",
        },
        {
            key: "readGroups",
            label: "Read groups and membership",
            type: "toggle",
            description: "One request per group. Needed for group sizes and the people in no group count.",
        },
        {
            key: "readProfiles",
            label: "Read user profiles",
            type: "toggle",
            description: "One profile service request per sampled person, for department, job title and photo.",
        },
        {
            key: "profileSample",
            label: "Profiles sampled",
            type: "number",
            min: 10,
            max: 5000,
            step: 10,
            description: "How many people to read profiles for, newest accounts first.",
        },
    ],
    stages: [
        {
            key: "users",
            label: "Read site users",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const api = SiteUsers(context.siteUrl);
                    const users = yield api.all();
                    let enriched = users;
                    try {
                        enriched = yield api.withInfoList(users);
                    }
                    catch (error) {
                        context.issue({ target: context.siteUrl, code: "error", message: toErrorMessage(error) });
                    }
                    context.data.users = [...((_a = context.data.users) !== null && _a !== void 0 ? _a : []), ...enriched];
                    context.data.scannedSites = [...((_b = context.data.scannedSites) !== null && _b !== void 0 ? _b : []), context.siteUrl];
                    context.log(`${enriched.filter((user) => user.isExternal).length} external principals`);
                    context.progress(enriched.length, enriched.length);
                });
            },
        },
        {
            key: "groups",
            label: "Read groups",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (!context.config.readGroups) {
                        context.progress(0, 0);
                        return;
                    }
                    const groups = yield SitePermissions(context.siteUrl).groups(true);
                    context.data.groups = [...((_a = context.data.groups) !== null && _a !== void 0 ? _a : []), ...groups];
                    context.progress(groups.length, groups.length);
                });
            },
        },
        {
            key: "profiles",
            label: "Read profiles",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (!context.config.readProfiles) {
                        context.progress(0, 0);
                        return;
                    }
                    const people = ((_a = context.data.users) !== null && _a !== void 0 ? _a : [])
                        .filter((user) => user.kind === "user" && !user.isSystem)
                        .sort((a, b) => { var _a, _b; return ((_a = b.createdIso) !== null && _a !== void 0 ? _a : "").localeCompare((_b = a.createdIso) !== null && _b !== void 0 ? _b : ""); })
                        .slice(0, context.config.profileSample);
                    const api = SiteUsers(context.siteUrl);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const profiles = (_b = context.data.profiles) !== null && _b !== void 0 ? _b : [];
                    for (let index = start; index < people.length; index = index + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index);
                            context.data.profiles = profiles;
                            return;
                        }
                        profiles.push(yield api.profile(people[index].loginName));
                        context.setCursor(index + 1);
                        context.progress(index + 1, people.length);
                    }
                    context.data.profiles = profiles;
                });
            },
        },
        {
            key: "summarise",
            label: "Summarise",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const users = (_a = context.data.users) !== null && _a !== void 0 ? _a : [];
                    context.progress(users.length, users.length);
                });
            },
        },
    ],
};
//# sourceMappingURL=UsersAudit.report.js.map