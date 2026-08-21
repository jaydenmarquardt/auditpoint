import { __awaiter } from "tslib";
import { SiteLists } from "../../api/Lists.api";
import { getSp } from "../../api/Sp.api";
import { throttled } from "../../api/Throttle.api";
import { pathKey, SiteAnalytics } from "../../api/Analytics.api";
import { toErrorMessage } from "../../utils/Guard.util";
export const ANALYTICS_AUDIT_KIND = "analytics-audit";
/** Pages sampled for daily rows when the site wide endpoints stay silent. */
const SAMPLE_PAGES = 25;
export const analyticsAuditReport = {
    kind: ANALYTICS_AUDIT_KIND,
    title: "Analytics audit",
    description: "Reads view counts, unique viewers and time spent for every page and file from the site analytics endpoints, then groups them by folder, area, file type and day.",
    iconName: "BarChartVertical",
    version: "1.0.0",
    schemaVersion: 1,
    defaultConfig: {
        days: 90,
        maxPages: 5000,
        scanFiles: true,
        maxLists: 100,
        maxFilesPerLibrary: 5000,
        orgUnitColumn: "",
        dailyDetailPages: 0,
        readHourly: true,
    },
    configFields: [
        {
            key: "days",
            label: "Days of history",
            type: "number",
            group: "What to scan",
            min: 7,
            max: 365,
            step: 1,
            description: "How far back the daily and hourly charts reach. The window totals always cover 7, 30, 90 and all time.",
        },
        {
            key: "scanFiles",
            label: "Include files in libraries",
            type: "toggle",
            group: "What to scan",
            description: "Adds view counts for documents and images alongside pages.",
        },
        {
            key: "readHourly",
            label: "Read hourly activity",
            type: "toggle",
            group: "What to scan",
            description: "One extra request for time of day. Tenants that do not support it simply return nothing.",
        },
        {
            key: "orgUnitColumn",
            label: "Organisational unit column",
            type: "text",
            group: "Columns and paths",
            description: "Internal name of the column naming the owning area. Defaults to the one set on the Settings page.",
        },
        {
            key: "maxPages",
            label: "Maximum pages",
            type: "number",
            group: "Limits",
            min: 50,
            max: 20000,
            step: 50,
            description: "Pages are read in bulk, so this is a ceiling rather than a cost per page.",
        },
        {
            key: "maxLists",
            label: "Maximum libraries",
            type: "number",
            group: "Limits",
            min: 1,
            max: 500,
            step: 1,
            description: "Upper bound on document libraries read for file views.",
        },
        {
            key: "maxFilesPerLibrary",
            label: "Maximum files per library",
            type: "number",
            group: "Limits",
            min: 50,
            max: 20000,
            step: 50,
            description: "Caps how many files are read from each library.",
        },
        {
            key: "dailyDetailPages",
            label: "Pages to pre-load daily detail for",
            type: "number",
            group: "Limits",
            min: 0,
            max: 500,
            step: 25,
            description: "Daily history costs one request per page, so this stays at zero unless the per page charts are needed. The most viewed pages are taken first.",
        },
    ],
    stages: [
        {
            key: "pages",
            work: "both",
            label: "Read pages and their view counts",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const analytics = SiteAnalytics(context.siteUrl);
                    const entries = keep(context, "page");
                    const items = yield readItems(context.siteUrl, "Site Pages", context.config.maxPages, context.config.orgUnitColumn);
                    const totals = index(yield analytics.itemTotals("Site Pages", context.config.maxPages));
                    items.forEach((item) => entries.push(toEntry(context.siteUrl, "page", "Site Pages", item, totals, context.config)));
                    context.data.entries = entries;
                    context.data.scannedSites = [...new Set([...((_a = context.data.scannedSites) !== null && _a !== void 0 ? _a : []), context.siteUrl])];
                    context.log(`${items.length} pages, ${totals.size} analytics rows matched`);
                    context.progress(items.length, items.length);
                });
            },
        },
        {
            key: "files",
            work: "both",
            label: "Read files and their view counts",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (!context.config.scanFiles) {
                        context.progress(0, 0);
                        return;
                    }
                    const analytics = SiteAnalytics(context.siteUrl);
                    const libraries = (yield SiteLists(context.siteUrl).getAll(false))
                        .filter((list) => list.kind === "library" && list.title !== "Site Pages" && list.itemCount > 0)
                        .slice(0, context.config.maxLists);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const entries = start === 0 ? keep(context, "file") : (_a = context.data.entries) !== null && _a !== void 0 ? _a : [];
                    for (let index_ = start; index_ < libraries.length; index_ = index_ + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index_);
                            context.data.entries = entries;
                            return;
                        }
                        const library = libraries[index_];
                        try {
                            const items = yield readItems(context.siteUrl, library.title, context.config.maxFilesPerLibrary, context.config.orgUnitColumn);
                            const totals = index(yield analytics.itemTotals(library.title, context.config.maxFilesPerLibrary));
                            items.forEach((item) => entries.push(toEntry(context.siteUrl, "file", library.title, item, totals, context.config)));
                        }
                        catch (error) {
                            context.issue({ target: library.title, code: (_b = statusOf(error)) !== null && _b !== void 0 ? _b : "error", message: toErrorMessage(error) });
                        }
                        context.setCursor(index_ + 1);
                        context.progress(index_ + 1, libraries.length);
                    }
                    context.data.entries = entries;
                });
            },
        },
        {
            key: "activity",
            work: "network",
            label: "Read site activity by day",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const analytics = SiteAnalytics(context.siteUrl);
                    const days = yield analytics.activityByDay(context.config.days);
                    if (days.length > 0) {
                        context.data.activity = days;
                        context.data.activitySampled = false;
                    }
                    else {
                        // No site wide endpoint answered, so the days are summed from the busiest
                        // pages instead and the report says so on screen.
                        const pages = ((_a = context.data.entries) !== null && _a !== void 0 ? _a : [])
                            .filter((entry) => entry.kind === "page")
                            .sort((first, second) => second.last90.views - first.last90.views)
                            .slice(0, SAMPLE_PAGES);
                        const sampled = new Map();
                        for (const page of pages) {
                            yield context.waitIfPaused();
                            if (context.isCancelled())
                                break;
                            try {
                                (yield analytics.itemDaily(page.listTitle, page.itemId, context.config.days)).forEach((day) => {
                                    var _a;
                                    const row = (_a = sampled.get(day.date)) !== null && _a !== void 0 ? _a : { date: day.date, views: 0, unique: 0, timeSpentSeconds: 0 };
                                    row.views = row.views + day.views;
                                    row.unique = row.unique + day.unique;
                                    row.timeSpentSeconds = row.timeSpentSeconds + day.timeSpentSeconds;
                                    sampled.set(day.date, row);
                                });
                            }
                            catch (error) {
                                context.issue({ target: page.title, code: (_b = statusOf(error)) !== null && _b !== void 0 ? _b : "error", message: toErrorMessage(error) });
                            }
                        }
                        context.data.activity = [...sampled.values()].sort((first, second) => first.date.localeCompare(second.date));
                        context.data.activitySampled = true;
                    }
                    context.data.hourly = context.config.readHourly ? yield analytics.activityByHour(context.config.days) : [];
                    context.log(`${((_c = context.data.activity) !== null && _c !== void 0 ? _c : []).length} days${context.data.activitySampled ? " (sampled from pages)" : ""}`);
                    context.progress(1, 1);
                });
            },
        },
        {
            key: "daily",
            work: "network",
            label: "Pre-load daily detail for top pages",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (context.config.dailyDetailPages <= 0) {
                        context.progress(0, 0);
                        return;
                    }
                    const analytics = SiteAnalytics(context.siteUrl);
                    const entries = (_a = context.data.entries) !== null && _a !== void 0 ? _a : [];
                    const targets = entries
                        .filter((entry) => entry.kind === "page" && entry.siteUrl === context.siteUrl && !entry.daily)
                        .sort((first, second) => second.last90.views - first.last90.views)
                        .slice(0, context.config.dailyDetailPages);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    for (let index_ = start; index_ < targets.length; index_ = index_ + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index_);
                            return;
                        }
                        const page = targets[index_];
                        try {
                            page.daily = yield analytics.itemDaily(page.listTitle, page.itemId, context.config.days);
                        }
                        catch (error) {
                            context.issue({ target: page.title, code: (_b = statusOf(error)) !== null && _b !== void 0 ? _b : "error", message: toErrorMessage(error) });
                        }
                        context.setCursor(index_ + 1);
                        context.progress(index_ + 1, targets.length);
                    }
                    context.data.entries = entries;
                });
            },
        },
        {
            key: "summarise",
            work: "client",
            label: "Summarise",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const entries = (_a = context.data.entries) !== null && _a !== void 0 ? _a : [];
                    const views = entries.reduce((total, entry) => total + entry.last90.views, 0);
                    context.log(`${entries.length} items measured, ${views} views in the last 90 days`);
                    context.progress(entries.length, entries.length);
                });
            },
        },
    ],
};
/** Items carry the identity; the analytics rows carry the numbers. */
function readItems(siteUrl, listTitle, top, orgUnitColumn) {
    return __awaiter(this, void 0, void 0, function* () {
        const select = ["Id", "Title", "FileLeafRef", "FileRef", "Modified", "GUID"];
        if (orgUnitColumn.trim())
            select.push(orgUnitColumn.trim());
        try {
            return (yield throttled(() => getSp(siteUrl).web.lists.getByTitle(listTitle).items.select(...select).top(top)(), { label: "Analytics.items" }));
        }
        catch (_a) {
            // A missing org unit column fails the whole request, so it is dropped and retried.
            return (yield throttled(() => getSp(siteUrl)
                .web.lists.getByTitle(listTitle)
                .items.select("Id", "Title", "FileLeafRef", "FileRef", "Modified", "GUID")
                .top(top)(), { label: "Analytics.items" }));
        }
    });
}
function index(rows) {
    const byKey = new Map();
    rows.forEach((row) => row.keys.forEach((key) => byKey.set(key, row)));
    return byKey;
}
const EMPTY = { views: 0, unique: 0, timeSpentSeconds: 0 };
function toEntry(siteUrl, kind, listTitle, item, totals, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const url = String((_a = item.FileRef) !== null && _a !== void 0 ? _a : "");
    const match = (_d = (_c = totals.get(String((_b = item.GUID) !== null && _b !== void 0 ? _b : "").toLowerCase())) !== null && _c !== void 0 ? _c : totals.get(pathKey(url))) !== null && _d !== void 0 ? _d : undefined;
    const name = String((_e = item.FileLeafRef) !== null && _e !== void 0 ? _e : "");
    return {
        siteUrl,
        kind,
        listTitle,
        itemId: Number(item.Id),
        title: String((_g = (_f = item.Title) !== null && _f !== void 0 ? _f : name) !== null && _g !== void 0 ? _g : url),
        url,
        folder: folderOf(url),
        orgUnit: orgUnitOf(item, config.orgUnitColumn),
        extension: (_j = (_h = name.split(".").pop()) === null || _h === void 0 ? void 0 : _h.toLowerCase()) !== null && _j !== void 0 ? _j : "",
        modified: String((_k = item.Modified) !== null && _k !== void 0 ? _k : ""),
        allTime: (_l = match === null || match === void 0 ? void 0 : match.allTime) !== null && _l !== void 0 ? _l : EMPTY,
        last7: (_m = match === null || match === void 0 ? void 0 : match.last7) !== null && _m !== void 0 ? _m : EMPTY,
        last30: (_o = match === null || match === void 0 ? void 0 : match.last30) !== null && _o !== void 0 ? _o : EMPTY,
        last90: (_p = match === null || match === void 0 ? void 0 : match.last90) !== null && _p !== void 0 ? _p : EMPTY,
    };
}
/** The folder a page sits in, which is how most sites are actually organised. */
function folderOf(url) {
    const parts = url.split("/").filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 2] : "";
}
function orgUnitOf(item, column) {
    var _a, _b;
    const value = column.trim() ? item[column.trim()] : undefined;
    if (!value)
        return "";
    if (typeof value === "object") {
        const lookup = value;
        return String((_b = (_a = lookup.Title) !== null && _a !== void 0 ? _a : lookup.Label) !== null && _b !== void 0 ? _b : "");
    }
    return String(value);
}
function keep(context, kind) {
    var _a;
    return ((_a = context.data.entries) !== null && _a !== void 0 ? _a : []).filter((entry) => !(entry.siteUrl === context.siteUrl && entry.kind === kind));
}
function statusOf(error) {
    var _a;
    const candidate = error;
    return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.status) !== null && _a !== void 0 ? _a : candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus;
}
//# sourceMappingURL=AnalyticsAudit.report.js.map