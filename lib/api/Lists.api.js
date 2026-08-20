import { __asyncValues, __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { toErrorMessage } from "../utils/Guard.util";
const TEMPLATE_NAMES = {
    100: "Custom list",
    101: "Document library",
    102: "Survey",
    103: "Links",
    104: "Announcements",
    105: "Contacts",
    106: "Calendar",
    107: "Tasks",
    108: "Discussion board",
    109: "Picture library",
    110: "Data sources",
    111: "Site template gallery",
    112: "User information",
    113: "Web part gallery",
    114: "List template gallery",
    115: "Form library",
    116: "Master page gallery",
    117: "No code workflows",
    118: "Workflow process",
    119: "Site pages",
    120: "Custom grid",
    121: "Solution gallery",
    122: "No code public workflows",
    123: "Theme gallery",
    124: "Data connection library",
    125: "Workflow history",
    126: "Project tasks",
    130: "Data connection library",
    140: "Workflow history",
    150: "Project tasks",
    170: "Promoted links",
    171: "Tasks",
    175: "Maintenance logs",
    333: "Design gallery",
    338: "App data catalog",
    398: "Sharing links",
    420: "Composed looks",
    544: "Sharing links",
    550: "Access request list",
    600: "External list",
    700: "Assets",
    850: "Publishing pages",
    1100: "Issue tracking",
    3100: "Access apps",
    3415: "Web template extensions",
    10102: "Site notebook",
};
const SELECT = [
    "Id",
    "Title",
    "Description",
    "BaseTemplate",
    "BaseType",
    "ItemCount",
    "Hidden",
    "Created",
    "LastItemModifiedDate",
    "EnableVersioning",
    "MajorVersionLimit",
    "ContentTypesEnabled",
    "HasUniqueRoleAssignments",
    "NoCrawl",
    "DefaultViewUrl",
    "RootFolder/ServerRelativeUrl",
];
const PAGE_SIZE = 2000;
export function SiteLists(webUrl) {
    return {
        getAll(includeHidden) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl).web.lists.select(...SELECT).expand("RootFolder")(), { label: "SiteLists.getAll" }));
                return rows.filter((row) => includeHidden || !row.Hidden).map(toSiteList);
            });
        },
        withStorage(list) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!list.serverRelativeUrl)
                    return list;
                // StorageMetrics is its own endpoint; $expand on the folder silently
                // returns nothing on many tenants.
                try {
                    const metrics = yield throttled(() => getSp(webUrl).web.getFolderByServerRelativePath(list.serverRelativeUrl).storageMetrics(), { label: "SiteLists.storage" });
                    return Object.assign(Object.assign({}, list), { storageBytes: Number((_a = metrics.TotalSize) !== null && _a !== void 0 ? _a : 0), fileCount: Number((_b = metrics.TotalFileCount) !== null && _b !== void 0 ? _b : 0) });
                }
                catch (error) {
                    return Object.assign(Object.assign({}, list), { metricsError: toErrorMessage(error) });
                }
            });
        },
        contentTypes(list) {
            return __awaiter(this, void 0, void 0, function* () {
                const types = (yield throttled(() => getSp(webUrl).web.lists.getById(list.id).contentTypes.select("Name", "Hidden")(), { label: "SiteLists.contentTypes" }));
                return types.filter((type) => !type.Hidden).map((type) => type.Name);
            });
        },
        /** One batched request for every list, rather than one call each. */
        contentTypesBulk(lists) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = new Map();
                if (lists.length === 0)
                    return result;
                const [batch, execute] = getSp(webUrl).batched();
                lists.forEach((list) => {
                    batch.web.lists
                        .getById(list.id)
                        .contentTypes.select("Name", "Hidden")()
                        .then((types) => {
                        result.set(list.id, types.filter((type) => !type.Hidden).map((type) => type.Name));
                    })
                        .catch(() => result.set(list.id, []));
                });
                yield throttled(() => execute(), { label: "SiteLists.contentTypesBulk" });
                return result;
            });
        },
        /** StorageMetrics is unavailable on many tenants, so sizes come from the items. */
        scanItems(list, maxItems) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                var _d, _e, _f, _g, _h, _j;
                const scan = { items: 0, folders: 0, files: 0, bytes: 0, truncated: false, extensions: {} };
                // File size only exists on library items, and only through the File object.
                const isLibrary = list.kind === "library" || list.baseTemplate === 101 || list.baseTemplate === 700;
                const base = getSp(webUrl).web.lists.getById(list.id).items;
                const items = (isLibrary
                    ? base.select("Id", "FSObjType", "FileLeafRef", "File/Length").expand("File")
                    : base.select("Id", "FSObjType", "FileLeafRef")).top(Math.min(PAGE_SIZE, Math.max(1, maxItems)));
                try {
                    for (var _k = true, items_1 = __asyncValues(items), items_1_1; items_1_1 = yield items_1.next(), _a = items_1_1.done, !_a; _k = true) {
                        _c = items_1_1.value;
                        _k = false;
                        const page = _c;
                        for (const row of page) {
                            if (scan.items >= maxItems) {
                                scan.truncated = true;
                                return scan;
                            }
                            scan.items = scan.items + 1;
                            if (Number(row.FSObjType) === 1) {
                                scan.folders = scan.folders + 1;
                                continue;
                            }
                            scan.files = scan.files + 1;
                            scan.bytes = scan.bytes + Number((_e = (_d = row.File) === null || _d === void 0 ? void 0 : _d.Length) !== null && _e !== void 0 ? _e : 0);
                            const extension = extensionOf(String((_f = row.FileLeafRef) !== null && _f !== void 0 ? _f : ""));
                            if (extension) {
                                const current = (_g = scan.extensions[extension]) !== null && _g !== void 0 ? _g : { count: 0, bytes: 0 };
                                scan.extensions[extension] = {
                                    count: current.count + 1,
                                    bytes: current.bytes + Number((_j = (_h = row.File) === null || _h === void 0 ? void 0 : _h.Length) !== null && _j !== void 0 ? _j : 0),
                                };
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_k && !_a && (_b = items_1.return)) yield _b.call(items_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return scan;
            });
        },
        settingsUrl(list) {
            return layout(webUrl, "listedit.aspx", list.id);
        },
        /** Advanced settings is where the search indexing switch lives. */
        advancedSettingsUrl(list) {
            return layout(webUrl, "advsetng.aspx", list.id);
        },
        permissionsUrl(list) {
            return layout(webUrl, "user.aspx", list.id);
        },
    };
}
function layout(webUrl, page, listId) {
    const site = (webUrl !== null && webUrl !== void 0 ? webUrl : "").replace(/\/$/, "");
    return `${site}/_layouts/15/${page}?List=${encodeURIComponent(`{${listId}}`)}`;
}
function extensionOf(fileName) {
    const match = /\.([a-z0-9]{1,8})$/i.exec(fileName);
    return match ? match[1].toLowerCase() : "";
}
function toSiteList(row) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        id: row.Id,
        title: row.Title,
        description: (_a = row.Description) !== null && _a !== void 0 ? _a : "",
        kind: kindOf(row),
        baseTemplate: row.BaseTemplate,
        templateName: (_b = TEMPLATE_NAMES[row.BaseTemplate]) !== null && _b !== void 0 ? _b : (row.BaseType === 1 ? "Other library" : "Other list"),
        itemCount: (_c = row.ItemCount) !== null && _c !== void 0 ? _c : 0,
        hidden: Boolean(row.Hidden),
        created: row.Created,
        lastItemModified: row.LastItemModifiedDate,
        serverRelativeUrl: (_e = (_d = row.RootFolder) === null || _d === void 0 ? void 0 : _d.ServerRelativeUrl) !== null && _e !== void 0 ? _e : "",
        defaultViewUrl: (_f = row.DefaultViewUrl) !== null && _f !== void 0 ? _f : "",
        versioningEnabled: Boolean(row.EnableVersioning),
        majorVersionLimit: (_g = row.MajorVersionLimit) !== null && _g !== void 0 ? _g : 0,
        contentTypesEnabled: Boolean(row.ContentTypesEnabled),
        hasUniquePermissions: Boolean(row.HasUniqueRoleAssignments),
        noCrawl: Boolean(row.NoCrawl),
    };
}
function kindOf(row) {
    if (row.Hidden)
        return "system";
    return row.BaseType === 1 ? "library" : "list";
}
//# sourceMappingURL=Lists.api.js.map