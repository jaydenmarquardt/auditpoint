import { __awaiter } from "tslib";
import { SiteLists } from "../../api/Lists.api";
import { toErrorMessage } from "../../utils/Guard.util";
export const LISTS_AUDIT_KIND = "lists-audit";
const BATCH_SIZE = 20;
export const listsAuditReport = {
    kind: LISTS_AUDIT_KIND,
    title: "Lists and libraries audit",
    description: "Inventories every list and library with item, folder and file counts, sizes, file types, content types, versioning and permission flags.",
    iconName: "BulletedList",
    version: "1.2.0",
    schemaVersion: 2,
    defaultConfig: {
        includeHidden: true,
        scanItems: true,
        readContentTypes: true,
        maxItemsPerList: 5000,
        staleDays: 365,
        maxLists: 500,
    },
    configFields: [
        {
            key: "includeHidden",
            label: "Include hidden and system lists",
            type: "toggle",
            description: "Adds catalogs and system lists such as the Master Page Gallery. Off keeps the report to content lists.",
        },
        {
            key: "readContentTypes",
            label: "Read content types",
            type: "toggle",
            description: "One batched request per 20 lists. Off if you only care about sizes and counts.",
        },
        {
            key: "scanItems",
            label: "Scan items for folders, files and sizes",
            type: "toggle",
            description: "Pages every list to count folders and files and sum file sizes. This is the slow part of the run.",
        },
        {
            key: "maxItemsPerList",
            label: "Maximum items scanned per list",
            type: "number",
            min: 100,
            max: 50000,
            step: 100,
            description: "Stops the scan on very large lists. Lists that hit the cap are flagged as partial.",
        },
        {
            key: "staleDays",
            label: "Stale after (days)",
            type: "number",
            min: 30,
            max: 3650,
            step: 30,
            description: "A list with no item changed in this many days counts as stale.",
        },
        {
            key: "maxLists",
            label: "Maximum lists per site",
            type: "number",
            min: 10,
            max: 2000,
            step: 10,
            description: "Upper bound on lists read per site, in case a site has thousands.",
        },
    ],
    stages: [
        {
            key: "inventory",
            label: "Read lists",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const lists = yield SiteLists(context.siteUrl).getAll(context.config.includeHidden);
                    const capped = lists
                        .slice(0, context.config.maxLists)
                        .map((list) => (Object.assign(Object.assign({}, list), { siteUrl: context.siteUrl })));
                    context.data.lists = [...((_a = context.data.lists) !== null && _a !== void 0 ? _a : []), ...capped];
                    context.data.scannedSites = [...((_b = context.data.scannedSites) !== null && _b !== void 0 ? _b : []), context.siteUrl];
                    context.progress(capped.length, capped.length);
                });
            },
        },
        {
            key: "contentTypes",
            label: "Read content types",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (!context.config.readContentTypes) {
                        context.progress(0, 0);
                        return;
                    }
                    const lists = (_a = context.data.lists) !== null && _a !== void 0 ? _a : [];
                    const forSite = lists.filter((list) => list.siteUrl === context.siteUrl);
                    const api = SiteLists(context.siteUrl);
                    // Batched: one request per chunk of lists instead of one per list.
                    for (let start = 0; start < forSite.length; start = start + BATCH_SIZE) {
                        yield context.waitIfPaused();
                        if (context.isCancelled())
                            return;
                        const chunk = forSite.slice(start, start + BATCH_SIZE);
                        try {
                            const byList = yield api.contentTypesBulk(chunk);
                            byList.forEach((types, id) => {
                                const index = lists.findIndex((candidate) => candidate.id === id);
                                if (index !== -1)
                                    lists[index] = Object.assign(Object.assign({}, lists[index]), { contentTypes: types });
                            });
                        }
                        catch (error) {
                            context.issue({
                                target: `${chunk.length} lists`,
                                code: (_b = statusOf(error)) !== null && _b !== void 0 ? _b : "error",
                                message: toErrorMessage(error),
                            });
                        }
                        context.progress(Math.min(start + BATCH_SIZE, forSite.length), forSite.length);
                    }
                });
            },
        },
        {
            key: "items",
            label: "Scan items",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!context.config.scanItems) {
                        context.data.storageAvailable = false;
                        context.progress(0, 0);
                        return;
                    }
                    let measured = 0;
                    yield forEachList(context, (api, list, index, lists) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        try {
                            context.log(`Scanning ${list.title}`, "debug");
                            const scan = yield api.scanItems(list, context.config.maxItemsPerList);
                            lists[index] = Object.assign(Object.assign({}, list), { scannedItems: scan.items, folderCount: scan.folders, fileCount: scan.files, storageBytes: scan.bytes, extensions: scan.extensions, scanTruncated: scan.truncated });
                            if (scan.bytes > 0)
                                measured = measured + 1;
                        }
                        catch (error) {
                            context.issue({ target: list.title, code: (_a = statusOf(error)) !== null && _a !== void 0 ? _a : "error", message: toErrorMessage(error) });
                        }
                    }));
                    context.data.storageAvailable = measured > 0;
                });
            },
        },
        {
            key: "summarise",
            label: "Summarise",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const lists = (_a = context.data.lists) !== null && _a !== void 0 ? _a : [];
                    context.progress(lists.length, lists.length);
                });
            },
        },
    ],
};
/** Shared cursor walk so both scanning stages resume mid-list. */
function forEachList(context, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const lists = (_a = context.data.lists) !== null && _a !== void 0 ? _a : [];
        const api = SiteLists(context.siteUrl);
        const start = typeof context.cursor === "number" ? context.cursor : 0;
        for (let index = start; index < lists.length; index = index + 1) {
            yield context.waitIfPaused();
            if (context.isCancelled()) {
                context.setCursor(index);
                return;
            }
            if (lists[index].siteUrl === context.siteUrl)
                yield handler(api, lists[index], index, lists);
            context.setCursor(index + 1);
            context.progress(index + 1, lists.length);
        }
    });
}
function statusOf(error) {
    var _a;
    const candidate = error;
    return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.status) !== null && _a !== void 0 ? _a : candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus;
}
//# sourceMappingURL=ListsAudit.report.js.map