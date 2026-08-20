import { SiteUsers } from "@/api/Users.api";
import { SitePermissions } from "@/api/SitePermissions.api";
import { ReportDefinition } from "@/core/report/Report.types";
import { UsersAuditConfig, UsersAuditData } from "@/modules/usersAudit/UsersAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const USERS_AUDIT_KIND = "users-audit";

export const usersAuditReport: ReportDefinition<UsersAuditData, UsersAuditConfig> = {
  kind: USERS_AUDIT_KIND,
  title: "Users and groups audit",
  description:
    "Reads the site user list with first seen and last changed dates, SharePoint groups and their members, and a sample of user profiles.",
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
      group: "Thresholds",
      min: 1,
      max: 60,
      step: 1,
      description: "How far back the added and changed charts run.",
    },
    {
      key: "recentDays",
      label: "Recent window (days)",
      type: "number",
      group: "Thresholds",
      min: 7,
      max: 365,
      step: 7,
      description: "A person counts as active when their site record changed inside this window.",
    },
    {
      key: "includeSystemAccounts",
      label: "Include system accounts",
      type: "toggle",
      group: "What to scan",
      description: "Keeps app and service identities in the counts. Off gives a cleaner people number.",
    },
    {
      key: "readGroups",
      label: "Read groups and membership",
      type: "toggle",
      group: "What to scan",
      description: "One request per group. Needed for group sizes and the people in no group count.",
    },
    {
      key: "readProfiles",
      label: "Read user profiles",
      type: "toggle",
      group: "What to scan",
      description: "One profile service request per sampled person, for department, job title and photo.",
    },
    {
      key: "profileSample",
      label: "Profiles sampled",
      type: "number",
      group: "Thresholds",
      min: 10,
      max: 5000,
      step: 10,
      description: "How many people to read profiles for, newest accounts first.",
    },
  ],

  stages: [
    {
      key: "users",
      work: "network",
      label: "Read site users",
      async run(context) {
        const api = SiteUsers(context.siteUrl);
        const users = await api.all();

        let enriched = users;

        try {
          enriched = await api.withInfoList(users);
        } catch (error) {
          context.issue({ target: context.siteUrl, code: "error", message: toErrorMessage(error) });
        }

        context.data.users = [...(context.data.users ?? []), ...enriched];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.log(`${enriched.filter((user) => user.isExternal).length} external principals`);
        context.progress(enriched.length, enriched.length);
      },
    },
    {
      key: "groups",
      work: "network",
      label: "Read groups",
      async run(context) {
        if (!context.config.readGroups) {
          context.progress(0, 0);
          return;
        }

        const groups = await SitePermissions(context.siteUrl).groups(true);
        context.data.groups = [...(context.data.groups ?? []), ...groups];
        context.progress(groups.length, groups.length);
      },
    },
    {
      key: "profiles",
      work: "network",
      label: "Read profiles",
      async run(context) {
        if (!context.config.readProfiles) {
          context.progress(0, 0);
          return;
        }

        const people = (context.data.users ?? [])
          .filter((user) => user.kind === "user" && !user.isSystem)
          .sort((a, b) => (b.createdIso ?? "").localeCompare(a.createdIso ?? ""))
          .slice(0, context.config.profileSample);

        const api = SiteUsers(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const profiles = context.data.profiles ?? [];

        for (let index = start; index < people.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.profiles = profiles;
            return;
          }

          profiles.push(await api.profile(people[index].loginName));

          context.setCursor(index + 1);
          context.progress(index + 1, people.length);
        }

        context.data.profiles = profiles;
      },
    },
    {
      key: "summarise",
      work: "client",
      label: "Summarise",
      async run(context) {
        const users = context.data.users ?? [];
        context.progress(users.length, users.length);
      },
    },
  ],
};
