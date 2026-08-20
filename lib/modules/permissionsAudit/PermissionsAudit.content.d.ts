export declare const PermissionsAuditContent: {
    readonly title: "Permissions";
    readonly description: "Who can reach this site and how: SharePoint groups and their members, the permission levels in use, every role assignment, where inheritance is broken, and grants made straight to a person rather than through a group.";
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
        readonly groups: "Groups";
        readonly levels: "Permission levels";
        readonly grants: "Grants";
        readonly unique: "Broken inheritance";
        readonly items: "Item breaks";
    };
    readonly stats: {
        readonly groups: "Groups";
        readonly members: "Group members";
        readonly empty: "Empty groups";
        readonly levels: "Permission levels";
        readonly custom: "Custom levels";
        readonly grants: "Role assignments";
        readonly direct: "Direct user grants";
        readonly external: "External principals";
        readonly everyone: "Everyone grants";
        readonly sharing: "Sharing link groups";
        readonly unique: "Lists with unique permissions";
        readonly itemBreaks: "Sampled items with unique permissions";
        readonly fullControl: "Full control grants";
    };
    readonly tileInfo: {
        readonly groups: "SharePoint groups defined on this site collection.";
        readonly members: "Total membership across those groups, counting a person once per group.";
        readonly empty: "Groups with no members. Usually leftovers, and confusing when picking a group to use.";
        readonly levels: "Permission levels available on the site.";
        readonly custom: "Levels that are not one of the built in roles, so someone created or edited them.";
        readonly grants: "Every role assignment found on the web and on lists with unique permissions.";
        readonly direct: "Permissions given straight to a person instead of through a group. These are the hardest to maintain.";
        readonly external: "Guest accounts holding permissions, identified by their login name.";
        readonly everyone: "Grants to Everyone or Everyone except external users, which open content to the whole tenant.";
        readonly sharing: "System groups created by sharing links. Many of these means a lot of ad hoc sharing.";
        readonly unique: "Lists that no longer inherit permissions from the site.";
        readonly itemBreaks: "Items in the sample that carry their own permissions.";
        readonly fullControl: "Assignments that include Full Control.";
    };
    readonly charts: {
        readonly kind: "Grants by principal type";
        readonly level: "Grants by permission level";
        readonly members: "Members by group";
        readonly inheritance: "Lists by inheritance";
    };
    readonly cardInfo: {
        readonly kind: "Users, SharePoint groups and directory groups holding permissions. Direct users are the ones to reduce.";
        readonly level: "Which permission levels are actually handed out, and how often.";
        readonly members: "Group sizes, so oversized or empty groups stand out.";
        readonly inheritance: "Lists inheriting site permissions against lists managing their own.";
    };
    readonly columns: {
        readonly group: "Group";
        readonly owner: "Owner";
        readonly members: "Members";
        readonly membership: "Membership";
        readonly level: "Permission level";
        readonly type: "Type";
        readonly builtIn: "Built in";
        readonly custom: "Custom";
        readonly description: "Description";
        readonly principal: "Principal";
        readonly kind: "Type";
        readonly scope: "Scope";
        readonly scopeType: "Scope type";
        readonly roles: "Permission levels";
        readonly flags: "Flags";
        readonly list: "List";
        readonly template: "Template";
        readonly items: "Items";
        readonly sampled: "Sampled";
        readonly broken: "Items with unique permissions";
        readonly actions: "Actions";
        readonly item: "Item";
    };
    readonly kinds: {
        readonly user: "User";
        readonly sharePointGroup: "SharePoint group";
        readonly securityGroup: "Security group";
        readonly distributionList: "Distribution list";
        readonly other: "Other";
    };
    readonly flags: {
        readonly external: "External";
        readonly everyone: "Everyone";
        readonly sharing: "Sharing link";
        readonly fullControl: "Full control";
        readonly siteAdmin: "Site admin";
    };
    readonly scope: {
        readonly web: "Site";
        readonly list: "List";
    };
    readonly level: {
        readonly rights: "Rights included";
        readonly holders: "Who holds it";
        readonly noRights: "No individual rights were returned for this level.";
        readonly noHolders: "Nothing in the scopes that were read uses this level.";
    };
    readonly openItem: "Open item";
    readonly noBrokenItems: "No item level breaks found";
    readonly noBrokenItemsHint: "Every item read inherits permissions from its list.";
    readonly itemsOffHint: "Turn on item sampling in the audit settings to find items that carry their own permissions.";
    readonly membershipOpen: "Members can edit membership";
    readonly membershipClosed: "Owners manage membership";
    readonly directNotice: "Permissions given directly to people are easy to lose track of. Where you can, move these into a group and grant the group instead.";
    readonly everyoneNotice: "One or more grants target Everyone. Check that the content is genuinely meant for the whole tenant.";
    readonly empty: {
        readonly title: "No audit yet";
        readonly description: "Run the audit to read groups, permission levels and every role assignment on this site.";
    };
    readonly search: {
        readonly groups: "Search groups";
        readonly levels: "Search levels";
        readonly grants: "Search grants";
        readonly unique: "Search lists";
        readonly items: "Search items";
    };
    readonly itemsOff: "Item level checks were off for this run.";
    readonly openPermissions: "Open permissions";
};
//# sourceMappingURL=PermissionsAudit.content.d.ts.map