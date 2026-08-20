export declare const UsersAuditContent: {
    readonly title: "Users and groups";
    readonly description: "Who has an account on this site, when they first appeared, how recently their record changed, which groups they sit in, and how complete their user profiles are.";
    readonly configTitle: "Audit settings";
    readonly historyTitle: "Previous runs";
    readonly moduleVersion: "Module";
    readonly backToRuns: "All runs";
    readonly run: "Run audit";
    readonly rerun: "Run again";
    readonly pause: "Pause";
    readonly resume: "Resume";
    readonly cancel: "Cancel";
    readonly exportCsv: "Export CSV";
    readonly review: "Review";
    readonly tabs: {
        readonly overview: "Overview";
        readonly users: "Users";
        readonly groups: "Groups";
    };
    readonly stats: {
        readonly users: "Site principals";
        readonly people: "People";
        readonly security: "Security groups";
        readonly external: "External users";
        readonly admins: "Site admins";
        readonly system: "System accounts";
        readonly added: "Added in window";
        readonly active: "Active recently";
        readonly dormant: "Not seen recently";
        readonly groups: "SharePoint groups";
        readonly members: "Group memberships";
        readonly average: "Average group size";
        readonly ungrouped: "People in no group";
        readonly profiles: "Profiles read";
        readonly department: "With a department";
        readonly picture: "With a photo";
    };
    readonly tileInfo: {
        readonly users: "Every principal in the site user list, people and directory groups alike.";
        readonly people: "Individual accounts, excluding directory and SharePoint groups.";
        readonly security: "Directory groups added to the site, which bring their own membership.";
        readonly external: "Guest accounts, identified by their login name.";
        readonly admins: "Accounts flagged as site collection administrators.";
        readonly system: "Service and system accounts such as the app identity, excluded from people counts when you choose.";
        readonly added: "People whose site record was created inside the timeframe set for this run.";
        readonly active: "People whose site record changed inside the recent window. It is a proxy for activity, not a sign in log.";
        readonly dormant: "People whose record has not changed inside the recent window.";
        readonly groups: "SharePoint groups on this site collection.";
        readonly members: "Total memberships, counting a person once per group.";
        readonly average: "Members per group, ignoring sharing link groups.";
        readonly ungrouped: "People holding an account but no SharePoint group membership.";
        readonly profiles: "User profiles read from the profile service for the sample.";
        readonly department: "Sampled profiles with a department filled in.";
        readonly picture: "Sampled profiles with a profile photo.";
    };
    readonly charts: {
        readonly added: "People added by month";
        readonly active: "People last changed by month";
        readonly kind: "Principals by type";
        readonly members: "Members by group";
        readonly department: "People by department";
        readonly completeness: "Profile completeness";
    };
    readonly cardInfo: {
        readonly added: "When accounts first appeared on this site, by month.";
        readonly active: "When each person's site record last changed, by month. Useful for spotting dormant accounts.";
        readonly kind: "People against directory groups and SharePoint groups in the site user list.";
        readonly members: "Group sizes, so oversized and empty groups stand out.";
        readonly department: "Departments across the sampled profiles.";
        readonly completeness: "How many sampled profiles carry a department, job title and photo.";
    };
    readonly columns: {
        readonly user: "User";
        readonly kind: "Type";
        readonly email: "Email";
        readonly created: "First seen";
        readonly modified: "Record changed";
        readonly flags: "Flags";
        readonly groups: "Groups";
        readonly group: "Group";
        readonly members: "Members";
        readonly owner: "Owner";
        readonly department: "Department";
        readonly jobTitle: "Job title";
        readonly office: "Office";
        readonly properties: "Profile properties";
        readonly photo: "Photo";
    };
    readonly kinds: {
        readonly user: "Person";
        readonly securityGroup: "Security group";
        readonly sharePointGroup: "SharePoint group";
        readonly other: "Other";
    };
    readonly flags: {
        readonly external: "External";
        readonly admin: "Site admin";
        readonly system: "System";
        readonly dormant: "Not seen recently";
    };
    readonly profilesOff: "Profile reading was off for this run.";
    readonly activityNote: "SharePoint does not expose a last sign in per site. First seen and record changed come from the site user information list, which updates when a person is added or their details change.";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to read site users, groups and profiles.";
    };
    readonly search: {
        readonly users: "Search users";
        readonly groups: "Search groups";
        readonly profiles: "Search profiles";
    };
    readonly allGroups: "All groups";
    readonly clearGroup: "Clear group filter";
    readonly yes: "Yes";
    readonly no: "No";
};
//# sourceMappingURL=UsersAudit.content.d.ts.map