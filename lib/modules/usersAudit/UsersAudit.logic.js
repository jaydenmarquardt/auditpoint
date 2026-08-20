import { UsersAuditContent } from "./UsersAudit.content";
const DAY = 24 * 60 * 60 * 1000;
export function kindLabel(kind) {
    return UsersAuditContent.kinds[kind];
}
export function isDormant(user, recentDays) {
    if (!user.modifiedIso)
        return false;
    return Date.now() - new Date(user.modifiedIso).getTime() > recentDays * DAY;
}
export function groupsByLogin(groups) {
    const map = new Map();
    groups.forEach((group) => group.members.forEach((member) => {
        var _a;
        const key = member.loginName.toLowerCase();
        map.set(key, [...((_a = map.get(key)) !== null && _a !== void 0 ? _a : []), group.title]);
    }));
    return map;
}
export function buildView(data, config) {
    var _a, _b, _c;
    const all = (_a = data === null || data === void 0 ? void 0 : data.users) !== null && _a !== void 0 ? _a : [];
    const users = config.includeSystemAccounts ? all : all.filter((user) => !user.isSystem);
    const people = users.filter((user) => user.kind === "user");
    const groups = ((_b = data === null || data === void 0 ? void 0 : data.groups) !== null && _b !== void 0 ? _b : []).filter((group) => !group.isSharingLink);
    const profiles = (_c = data === null || data === void 0 ? void 0 : data.profiles) !== null && _c !== void 0 ? _c : [];
    const windowStart = Date.now() - config.months * 30 * DAY;
    const recentStart = Date.now() - config.recentDays * DAY;
    const memberLogins = new Set(groups.flatMap((group) => group.members.map((member) => member.loginName.toLowerCase())));
    const ungrouped = people.filter((user) => !memberLogins.has(user.loginName.toLowerCase()));
    const totals = {
        users: users.length,
        people: people.length,
        securityGroups: users.filter((user) => user.kind === "securityGroup").length,
        external: users.filter((user) => user.isExternal).length,
        siteAdmins: users.filter((user) => user.isSiteAdmin).length,
        system: all.filter((user) => user.isSystem).length,
        addedInWindow: people.filter((user) => user.createdIso && new Date(user.createdIso).getTime() >= windowStart)
            .length,
        activeRecently: people.filter((user) => user.modifiedIso && new Date(user.modifiedIso).getTime() >= recentStart).length,
        dormant: people.filter((user) => isDormant(user, config.recentDays)).length,
        groups: groups.length,
        groupMembers: groups.reduce((sum, group) => sum + group.memberCount, 0),
        averageGroupSize: groups.length === 0
            ? 0
            : Math.round((groups.reduce((sum, group) => sum + group.memberCount, 0) / groups.length) * 10) / 10,
        usersWithoutGroup: ungrouped.length,
        profilesRead: profiles.length,
        withDepartment: profiles.filter((profile) => profile.department).length,
        withJobTitle: profiles.filter((profile) => profile.jobTitle).length,
        withPicture: profiles.filter((profile) => profile.hasPicture).length,
    };
    return {
        totals,
        addedByMonth: byMonth(people.map((user) => user.createdIso), config.months),
        activeByMonth: byMonth(people.map((user) => user.modifiedIso), config.months),
        usersByKind: countBy(users.map((user) => kindLabel(user.kind))),
        membersByGroup: groups
            .map((group) => ({ label: group.title, value: group.memberCount }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 12),
        byDepartment: countBy(profiles.map((profile) => profile.department).filter(Boolean)).slice(0, 12),
        profileCompleteness: [
            { label: UsersAuditContent.stats.department, value: totals.withDepartment },
            { label: UsersAuditContent.columns.jobTitle, value: totals.withJobTitle },
            { label: UsersAuditContent.stats.picture, value: totals.withPicture },
        ],
        ungrouped,
    };
}
/** Buckets ISO dates into the last N months, oldest first. */
function byMonth(dates, months) {
    const buckets = new Map();
    const now = new Date();
    for (let index = months - 1; index >= 0; index = index - 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
        buckets.set(monthKey(date), 0);
    }
    dates.forEach((iso) => {
        var _a;
        if (!iso)
            return;
        const key = monthKey(new Date(iso));
        if (buckets.has(key))
            buckets.set(key, ((_a = buckets.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    });
    return [...buckets.entries()].map(([label, value]) => ({ label, value }));
}
function monthKey(date) {
    return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
//# sourceMappingURL=UsersAudit.logic.js.map