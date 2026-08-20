import { SiteUser } from "@/api/Users.types";
import { UsersAuditContent } from "@/modules/usersAudit/UsersAudit.content";
import { UsersAuditConfig, UsersAuditData, UsersAuditView, UsersTotals } from "@/modules/usersAudit/UsersAudit.types";

const DAY = 24 * 60 * 60 * 1000;

export function kindLabel(kind: SiteUser["kind"]): string {
  return UsersAuditContent.kinds[kind];
}

export function isDormant(user: SiteUser, recentDays: number): boolean {
  if (!user.modifiedIso) return false;
  return Date.now() - new Date(user.modifiedIso).getTime() > recentDays * DAY;
}

export function groupsByLogin(groups: { title: string; members: { loginName: string }[] }[]): Map<string, string[]> {
  const map = new Map<string, string[]>();

  groups.forEach((group) =>
    group.members.forEach((member) => {
      const key = member.loginName.toLowerCase();
      map.set(key, [...(map.get(key) ?? []), group.title]);
    })
  );

  return map;
}

export function buildView(
  data: Partial<UsersAuditData> | undefined,
  config: UsersAuditConfig
): UsersAuditView {
  const all = data?.users ?? [];
  const users = config.includeSystemAccounts ? all : all.filter((user) => !user.isSystem);
  const people = users.filter((user) => user.kind === "user");
  const groups = (data?.groups ?? []).filter((group) => !group.isSharingLink);
  const profiles = data?.profiles ?? [];

  const windowStart = Date.now() - config.months * 30 * DAY;
  const recentStart = Date.now() - config.recentDays * DAY;

  const memberLogins = new Set(
    groups.flatMap((group) => group.members.map((member) => member.loginName.toLowerCase()))
  );

  const ungrouped = people.filter((user) => !memberLogins.has(user.loginName.toLowerCase()));

  const totals: UsersTotals = {
    users: users.length,
    people: people.length,
    securityGroups: users.filter((user) => user.kind === "securityGroup").length,
    external: users.filter((user) => user.isExternal).length,
    siteAdmins: users.filter((user) => user.isSiteAdmin).length,
    system: all.filter((user) => user.isSystem).length,
    addedInWindow: people.filter((user) => user.createdIso && new Date(user.createdIso).getTime() >= windowStart)
      .length,
    activeRecently: people.filter(
      (user) => user.modifiedIso && new Date(user.modifiedIso).getTime() >= recentStart
    ).length,
    dormant: people.filter((user) => isDormant(user, config.recentDays)).length,
    groups: groups.length,
    groupMembers: groups.reduce((sum, group) => sum + group.memberCount, 0),
    averageGroupSize:
      groups.length === 0
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
function byMonth(dates: (string | undefined)[], months: number): { label: string; value: number }[] {
  const buckets = new Map<string, number>();
  const now = new Date();

  for (let index = months - 1; index >= 0; index = index - 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    buckets.set(monthKey(date), 0);
  }

  dates.forEach((iso) => {
    if (!iso) return;
    const key = monthKey(new Date(iso));
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });

  return [...buckets.entries()].map(([label, value]) => ({ label, value }));
}

function monthKey(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function countBy(values: string[]): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
