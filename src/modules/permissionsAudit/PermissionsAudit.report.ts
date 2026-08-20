import { SiteLists } from "@/api/Lists.api";
import { SitePermissions } from "@/api/SitePermissions.api";
import { UniqueScope } from "@/api/SitePermissions.types";
import { SiteList } from "@/api/Lists.types";
import { ReportDefinition } from "@/core/report/Report.types";
import { PermissionsAuditConfig, PermissionsAuditData } from "@/modules/permissionsAudit/PermissionsAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const PERMISSIONS_AUDIT_KIND = "permissions-audit";

export const permissionsAuditReport: ReportDefinition<PermissionsAuditData, PermissionsAuditConfig> = {
  kind: PERMISSIONS_AUDIT_KIND,
  title: "Permissions audit",
  description:
    "Reads groups and their members, permission levels, role assignments on the site and on every list that breaks inheritance, and samples items for item level breaks.",
  iconName: "Permissions",
  version: "1.1.0",
  schemaVersion: 1,

  defaultConfig: {
    readGroupMembers: true,
    includeHidden: false,
    readListGrants: true,
    checkItemBreaks: false,
    itemBreakScope: "unique",
    itemSampleSize: 5000,
    maxLists: 300,
  },

  configFields: [
    {
      key: "readGroupMembers",
      label: "Read group members",
      type: "toggle",
      group: "What to scan",
      description: "One request per group. Off gives you the group list without membership.",
    },
    {
      key: "includeHidden",
      label: "Include hidden and system lists",
      type: "toggle",
      group: "What to scan",
      description: "System lists often carry their own permissions by design, which adds noise.",
    },
    {
      key: "readListGrants",
      label: "Read grants on lists with unique permissions",
      type: "toggle",
      group: "What to scan",
      description: "One request per list that has broken inheritance, to see who was given what.",
    },
    {
      key: "checkItemBreaks",
      label: "Sample items for item level permissions",
      type: "toggle",
      group: "What to scan",
      description: "Reads a page of items per list and counts those carrying their own permissions. Slow on large lists.",
    },
    {
      key: "itemBreakScope",
      label: "Where to look for item breaks",
      type: "choice",
      group: "Options",
      options: [
        { key: "unique", text: "Lists that already break inheritance" },
        { key: "all", text: "Every list on the site" },
      ],
      description: "Item level breaks can exist in any list. Checking every list is thorough and slow.",
    },
    {
      key: "itemSampleSize",
      label: "Maximum items read per list",
      type: "number",
      group: "Thresholds",
      min: 100,
      max: 100000,
      step: 100,
      description: "Items are read in pages of 2000 until this cap, so a whole list can be checked.",
    },
    {
      key: "maxLists",
      label: "Maximum lists per site",
      type: "number",
      group: "Limits",
      min: 10,
      max: 2000,
      step: 10,
      description: "Upper bound on lists inspected per site.",
    },
  ],

  stages: [
    {
      key: "levels",
      work: "network",
      label: "Read permission levels",
      async run(context) {
        const levels = await SitePermissions(context.siteUrl).levels();

        context.data.levels = [...(context.data.levels ?? []), ...levels];
        context.data.scannedSites = [...(context.data.scannedSites ?? []), context.siteUrl];
        context.log(`${levels.filter((level) => level.isCustom).length} custom levels`);
        context.progress(levels.length, levels.length);
      },
    },
    {
      key: "groups",
      work: "network",
      label: "Read groups",
      async run(context) {
        const groups = await SitePermissions(context.siteUrl).groups(context.config.readGroupMembers);

        context.data.groups = [...(context.data.groups ?? []), ...groups];
        context.progress(groups.length, groups.length);
      },
    },
    {
      key: "siteGrants",
      work: "network",
      label: "Read site grants",
      async run(context) {
        const grants = await SitePermissions(context.siteUrl).webGrants(context.siteUrl);

        context.data.grants = [...(context.data.grants ?? []), ...grants];
        context.log(`${grants.filter((grant) => grant.kind === "user").length} direct user grants on the site`);
        context.progress(grants.length, grants.length);
      },
    },
    {
      key: "scopes",
      work: "network",
      label: "Find broken inheritance",
      async run(context) {
        const lists = await SiteLists(context.siteUrl).getAll(context.config.includeHidden);
        const capped = lists.slice(0, context.config.maxLists);

        context.data.allLists = [...(context.data.allLists ?? []), ...capped];

        const unique: UniqueScope[] = capped
          .filter((list) => list.hasUniquePermissions)
          .map((list) => ({
            siteUrl: context.siteUrl,
            listId: list.id,
            title: list.title,
            url: list.serverRelativeUrl,
            templateName: list.templateName,
            itemCount: list.itemCount,
          }));

        context.data.scopes = [...(context.data.scopes ?? []), ...unique];
        context.data.listCount = (context.data.listCount ?? 0) + capped.length;
        context.log(`${unique.length} of ${capped.length} lists have unique permissions`);
        context.progress(capped.length, capped.length);
      },
    },
    {
      key: "listGrants",
      work: "network",
      label: "Read list grants",
      async run(context) {
        if (!context.config.readListGrants) {
          context.progress(0, 0);
          return;
        }

        const scopes = (context.data.scopes ?? []).filter((scope) => scope.siteUrl === context.siteUrl);
        const api = SitePermissions(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const grants = context.data.grants ?? [];

        for (let index = start; index < scopes.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.grants = grants;
            return;
          }

          const scope = scopes[index];

          try {
            grants.push(...(await api.listGrants(asList(scope))));
          } catch (error) {
            context.issue({ target: scope.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, scopes.length);
        }

        context.data.grants = grants;
      },
    },
    {
      key: "itemBreaks",
      work: "network",
      label: "Sample item permissions",
      async run(context) {
        if (!context.config.checkItemBreaks) {
          context.progress(0, 0);
          return;
        }

        const scopes = context.data.scopes ?? [];
        const everyList = (context.data.allLists ?? []).filter((list) => list.siteUrl === context.siteUrl);

        const targets: UniqueScope[] =
          context.config.itemBreakScope === "all"
            ? everyList.filter((list) => list.itemCount > 0).map(toScope)
            : scopes.filter((scope) => scope.siteUrl === context.siteUrl && scope.itemCount > 0);

        const api = SitePermissions(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const broken = context.data.brokenItems ?? [];

        for (let index = start; index < targets.length; index = index + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index);
            context.data.brokenItems = broken;
            return;
          }

          const target = targets[index];

          try {
            const result = await api.itemsWithUniquePermissions(asList(target), context.config.itemSampleSize);
            broken.push(...result.items);

            const merged: UniqueScope = {
              ...target,
              itemsChecked: result.checked,
              itemsWithUniquePermissions: result.unique,
            };

            const position = scopes.findIndex(
              (scope) => scope.siteUrl === target.siteUrl && scope.listId === target.listId
            );

            if (position === -1) {
              if (result.unique > 0) scopes.push(merged);
            } else {
              scopes[position] = merged;
            }
          } catch (error) {
            context.issue({ target: target.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index + 1);
          context.progress(index + 1, targets.length);
        }

        context.data.scopes = scopes;
        context.data.brokenItems = broken;
        context.log(`${broken.length} items carry their own permissions`);
      },
    },
  ],
};

function toScope(list: SiteList): UniqueScope {
  return {
    siteUrl: list.siteUrl ?? "",
    listId: list.id,
    title: list.title,
    url: list.serverRelativeUrl,
    templateName: list.templateName,
    itemCount: list.itemCount,
  };
}

function asList(scope: UniqueScope): Parameters<ReturnType<typeof SitePermissions>["listGrants"]>[0] {
  return {
    id: scope.listId,
    siteUrl: scope.siteUrl,
    title: scope.title,
    description: "",
    kind: "list",
    baseTemplate: 100,
    templateName: scope.templateName,
    itemCount: scope.itemCount,
    hidden: false,
    created: "",
    lastItemModified: "",
    serverRelativeUrl: scope.url,
    defaultViewUrl: "",
    versioningEnabled: false,
    majorVersionLimit: 0,
    contentTypesEnabled: false,
    hasUniquePermissions: true,
    noCrawl: false,
  };
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
