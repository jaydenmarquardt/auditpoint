import { __awaiter } from "tslib";
import { SiteLists } from "../../api/Lists.api";
import { SitePermissions } from "../../api/SitePermissions.api";
import { toErrorMessage } from "../../utils/Guard.util";
export const PERMISSIONS_AUDIT_KIND = "permissions-audit";
export const permissionsAuditReport = {
    kind: PERMISSIONS_AUDIT_KIND,
    title: "Permissions audit",
    description: "Reads groups and their members, permission levels, role assignments on the site and on every list that breaks inheritance, and samples items for item level breaks.",
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
            description: "One request per group. Off gives you the group list without membership.",
        },
        {
            key: "includeHidden",
            label: "Include hidden and system lists",
            type: "toggle",
            description: "System lists often carry their own permissions by design, which adds noise.",
        },
        {
            key: "readListGrants",
            label: "Read grants on lists with unique permissions",
            type: "toggle",
            description: "One request per list that has broken inheritance, to see who was given what.",
        },
        {
            key: "checkItemBreaks",
            label: "Sample items for item level permissions",
            type: "toggle",
            description: "Reads a page of items per list and counts those carrying their own permissions. Slow on large lists.",
        },
        {
            key: "itemBreakScope",
            label: "Where to look for item breaks",
            type: "choice",
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
            min: 100,
            max: 100000,
            step: 100,
            description: "Items are read in pages of 2000 until this cap, so a whole list can be checked.",
        },
        {
            key: "maxLists",
            label: "Maximum lists per site",
            type: "number",
            min: 10,
            max: 2000,
            step: 10,
            description: "Upper bound on lists inspected per site.",
        },
    ],
    stages: [
        {
            key: "levels",
            label: "Read permission levels",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const levels = yield SitePermissions(context.siteUrl).levels();
                    context.data.levels = [...((_a = context.data.levels) !== null && _a !== void 0 ? _a : []), ...levels];
                    context.data.scannedSites = [...((_b = context.data.scannedSites) !== null && _b !== void 0 ? _b : []), context.siteUrl];
                    context.log(`${levels.filter((level) => level.isCustom).length} custom levels`);
                    context.progress(levels.length, levels.length);
                });
            },
        },
        {
            key: "groups",
            label: "Read groups",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const groups = yield SitePermissions(context.siteUrl).groups(context.config.readGroupMembers);
                    context.data.groups = [...((_a = context.data.groups) !== null && _a !== void 0 ? _a : []), ...groups];
                    context.progress(groups.length, groups.length);
                });
            },
        },
        {
            key: "siteGrants",
            label: "Read site grants",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const grants = yield SitePermissions(context.siteUrl).webGrants(context.siteUrl);
                    context.data.grants = [...((_a = context.data.grants) !== null && _a !== void 0 ? _a : []), ...grants];
                    context.log(`${grants.filter((grant) => grant.kind === "user").length} direct user grants on the site`);
                    context.progress(grants.length, grants.length);
                });
            },
        },
        {
            key: "scopes",
            label: "Find broken inheritance",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const lists = yield SiteLists(context.siteUrl).getAll(context.config.includeHidden);
                    const capped = lists.slice(0, context.config.maxLists);
                    context.data.allLists = [...((_a = context.data.allLists) !== null && _a !== void 0 ? _a : []), ...capped];
                    const unique = capped
                        .filter((list) => list.hasUniquePermissions)
                        .map((list) => ({
                        siteUrl: context.siteUrl,
                        listId: list.id,
                        title: list.title,
                        url: list.serverRelativeUrl,
                        templateName: list.templateName,
                        itemCount: list.itemCount,
                    }));
                    context.data.scopes = [...((_b = context.data.scopes) !== null && _b !== void 0 ? _b : []), ...unique];
                    context.data.listCount = ((_c = context.data.listCount) !== null && _c !== void 0 ? _c : 0) + capped.length;
                    context.log(`${unique.length} of ${capped.length} lists have unique permissions`);
                    context.progress(capped.length, capped.length);
                });
            },
        },
        {
            key: "listGrants",
            label: "Read list grants",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    if (!context.config.readListGrants) {
                        context.progress(0, 0);
                        return;
                    }
                    const scopes = ((_a = context.data.scopes) !== null && _a !== void 0 ? _a : []).filter((scope) => scope.siteUrl === context.siteUrl);
                    const api = SitePermissions(context.siteUrl);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const grants = (_b = context.data.grants) !== null && _b !== void 0 ? _b : [];
                    for (let index = start; index < scopes.length; index = index + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index);
                            context.data.grants = grants;
                            return;
                        }
                        const scope = scopes[index];
                        try {
                            grants.push(...(yield api.listGrants(asList(scope))));
                        }
                        catch (error) {
                            context.issue({ target: scope.title, code: (_c = statusOf(error)) !== null && _c !== void 0 ? _c : "error", message: toErrorMessage(error) });
                        }
                        context.setCursor(index + 1);
                        context.progress(index + 1, scopes.length);
                    }
                    context.data.grants = grants;
                });
            },
        },
        {
            key: "itemBreaks",
            label: "Sample item permissions",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    if (!context.config.checkItemBreaks) {
                        context.progress(0, 0);
                        return;
                    }
                    const scopes = (_a = context.data.scopes) !== null && _a !== void 0 ? _a : [];
                    const everyList = ((_b = context.data.allLists) !== null && _b !== void 0 ? _b : []).filter((list) => list.siteUrl === context.siteUrl);
                    const targets = context.config.itemBreakScope === "all"
                        ? everyList.filter((list) => list.itemCount > 0).map(toScope)
                        : scopes.filter((scope) => scope.siteUrl === context.siteUrl && scope.itemCount > 0);
                    const api = SitePermissions(context.siteUrl);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const broken = (_c = context.data.brokenItems) !== null && _c !== void 0 ? _c : [];
                    for (let index = start; index < targets.length; index = index + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index);
                            context.data.brokenItems = broken;
                            return;
                        }
                        const target = targets[index];
                        try {
                            const result = yield api.itemsWithUniquePermissions(asList(target), context.config.itemSampleSize);
                            broken.push(...result.items);
                            const merged = Object.assign(Object.assign({}, target), { itemsChecked: result.checked, itemsWithUniquePermissions: result.unique });
                            const position = scopes.findIndex((scope) => scope.siteUrl === target.siteUrl && scope.listId === target.listId);
                            if (position === -1) {
                                if (result.unique > 0)
                                    scopes.push(merged);
                            }
                            else {
                                scopes[position] = merged;
                            }
                        }
                        catch (error) {
                            context.issue({ target: target.title, code: (_d = statusOf(error)) !== null && _d !== void 0 ? _d : "error", message: toErrorMessage(error) });
                        }
                        context.setCursor(index + 1);
                        context.progress(index + 1, targets.length);
                    }
                    context.data.scopes = scopes;
                    context.data.brokenItems = broken;
                    context.log(`${broken.length} items carry their own permissions`);
                });
            },
        },
    ],
};
function toScope(list) {
    var _a;
    return {
        siteUrl: (_a = list.siteUrl) !== null && _a !== void 0 ? _a : "",
        listId: list.id,
        title: list.title,
        url: list.serverRelativeUrl,
        templateName: list.templateName,
        itemCount: list.itemCount,
    };
}
function asList(scope) {
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
function statusOf(error) {
    var _a;
    const candidate = error;
    return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.status) !== null && _a !== void 0 ? _a : candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus;
}
//# sourceMappingURL=PermissionsAudit.report.js.map