import { __awaiter } from "tslib";
import { SPHttpClient } from "@microsoft/sp-http";
import { getContext, getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
/** Rows per bulk page, and how many pages are ever walked, so one list cannot run away. */
const BULK_PAGE_SIZE = 200;
const MAX_BULK_PAGES = 200;
const identifierCache = new Map();
const listIdCache = new Map();
/**
 * The analytics the SharePoint page usage panel itself reads: the v2.1 site
 * endpoints, not search. Search reports what it has indexed, which lags and
 * omits anything it was never told about; these numbers are the ones the
 * product shows its own users.
 */
export function SiteAnalytics(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    const json = (url, label) => __awaiter(this, void 0, void 0, function* () {
        return throttled(() => __awaiter(this, void 0, void 0, function* () {
            const response = yield getContext().spHttpClient.get(url, SPHttpClient.configurations.v1, {
                headers: { accept: "application/json;odata.metadata=minimal" },
            });
            if (response.status === 429 || response.status === 503) {
                throw Object.assign(new Error(`Throttled (${response.status})`), {
                    status: response.status,
                    headers: response.headers,
                });
            }
            if (!response.ok) {
                throw Object.assign(new Error(`${label} failed (${response.status})`), { status: response.status });
            }
            return (yield response.json());
        }), { label });
    });
    const api = {
        identifiers() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const cached = identifierCache.get(site);
                if (cached)
                    return cached;
                const absolute = (webUrl !== null && webUrl !== void 0 ? webUrl : getContext().pageContext.web.absoluteUrl).replace(/\/$/, "");
                const host = new URL(absolute, window.location.origin).hostname;
                const [web, collection] = yield Promise.all([
                    throttled(() => getSp(webUrl).web.select("Id")(), { label: "Analytics.web" }),
                    json(`${absolute}/_api/site?$select=Id`, "Analytics.site"),
                ]);
                const siteId = String((_a = collection.Id) !== null && _a !== void 0 ? _a : "");
                const webId = String((_b = web.Id) !== null && _b !== void 0 ? _b : "");
                if (!siteId || !webId)
                    throw new Error("Unable to resolve this site's identifiers.");
                const identifiers = { host, siteId, webId, siteKey: `${host},${siteId},${webId}` };
                identifierCache.set(site, identifiers);
                return identifiers;
            });
        },
        listId(title) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = `${site}|${title}`;
                const cached = listIdCache.get(key);
                if (cached)
                    return cached;
                const list = (yield throttled(() => getSp(webUrl).web.lists.getByTitle(title).select("Id")(), {
                    label: "Analytics.listId",
                }));
                listIdCache.set(key, list.Id);
                return list.Id;
            });
        },
        /**
         * Every item's view windows in a handful of paged requests. Asking each item
         * for its own analytics costs seconds each and never finishes on a real site.
         * The trade is detail: this gives the windows, not the daily rows.
         */
        itemTotals(listTitle, max) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { host, siteKey } = yield api.identifiers();
                const listId = yield api.listId(listTitle);
                const expand = encodeURIComponent("analytics($expand=allTime,lastSevenDays,lastThirtyDays,lastNinetyDays)");
                const totals = [];
                let url = `https://${host}/_api/v2.1/sites/${siteKey}/lists/${listId}/items?$expand=${expand}&$top=${BULK_PAGE_SIZE}`;
                for (let page = 0; page < MAX_BULK_PAGES && url && totals.length < max; page = page + 1) {
                    const body = yield json(url, "Analytics.bulk");
                    const rows = Array.isArray(body.value) ? body.value : [];
                    rows.forEach((row) => {
                        var _a;
                        const analytics = ((_a = row.analytics) !== null && _a !== void 0 ? _a : {});
                        totals.push({
                            keys: rowKeys(row),
                            allTime: windowTotals(analytics.allTime),
                            last7: windowTotals(analytics.lastSevenDays),
                            last30: windowTotals(analytics.lastThirtyDays),
                            last90: windowTotals(analytics.lastNinetyDays),
                        });
                    });
                    url = String((_b = (_a = body["@odata.nextLink"]) !== null && _a !== void 0 ? _a : body["@nextLink"]) !== null && _b !== void 0 ? _b : "");
                }
                return totals;
            });
        },
        /**
         * Daily activity for the whole site. Tenants disagree about which shape
         * exists, so each is tried in turn and the first that answers wins.
         */
        activityByDay(days) {
            return __awaiter(this, void 0, void 0, function* () {
                const { host, siteKey } = yield api.identifiers();
                const end = new Date();
                const start = new Date(end.getTime() - Math.max(1, days) * 86400000);
                const range = `startDateTime='${start.toISOString()}',endDateTime='${end.toISOString()}'`;
                const base = `https://${host}/_api/v2.1/sites/${siteKey}`;
                const candidates = [
                    `${base}/analytics/getActivitiesByInterval(${range},interval='day')`,
                    `${base}/getActivitiesByInterval(${range},interval='day')`,
                    `${base}/oneDrive.getAggregatedAnalytics?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}&$expand=${encodeURIComponent("accessStatsByDay($expand=itemActivityStats)")}`,
                ];
                for (const url of candidates) {
                    try {
                        return toDays(rowsFrom(yield json(url, "Analytics.activity")));
                    }
                    catch (_a) {
                        // Endpoint missing on this tenant, so try the next shape.
                    }
                }
                return [];
            });
        },
        /** Hourly buckets, where the tenant answers at that interval. */
        activityByHour(days) {
            return __awaiter(this, void 0, void 0, function* () {
                const { host, siteKey } = yield api.identifiers();
                const end = new Date();
                const start = new Date(end.getTime() - Math.max(1, days) * 86400000);
                const range = `startDateTime='${start.toISOString()}',endDateTime='${end.toISOString()}'`;
                try {
                    const body = yield json(`https://${host}/_api/v2.1/sites/${siteKey}/analytics/getActivitiesByInterval(${range},interval='hour')`, "Analytics.hourly");
                    const byHour = new Map();
                    rowsFrom(body).forEach((row) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        const stamp = new Date(String((_c = (_b = (_a = row.startDateTime) !== null && _a !== void 0 ? _a : row.activityDateTime) !== null && _b !== void 0 ? _b : row.date) !== null && _c !== void 0 ? _c : ""));
                        if (!Number.isFinite(stamp.getTime()))
                            return;
                        const access = ((_d = row.access) !== null && _d !== void 0 ? _d : row);
                        const entry = (_e = byHour.get(stamp.getHours())) !== null && _e !== void 0 ? _e : { hour: stamp.getHours(), views: 0, unique: 0 };
                        entry.views = entry.views + Number((_f = access.actionCount) !== null && _f !== void 0 ? _f : 0);
                        entry.unique = entry.unique + Number((_g = access.actorCount) !== null && _g !== void 0 ? _g : 0);
                        byHour.set(entry.hour, entry);
                    });
                    return [...byHour.values()].sort((first, second) => first.hour - second.hour);
                }
                catch (_a) {
                    return [];
                }
            });
        },
        /** Daily rows for one item, which is what the bulk call cannot give. */
        itemDaily(listTitle, itemId, days) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { host, siteKey } = yield api.identifiers();
                const listId = yield api.listId(listTitle);
                const end = new Date();
                const start = new Date(end.getTime() - Math.max(1, days) * 86400000);
                const params = new URLSearchParams({
                    startDateTime: start.toISOString(),
                    endDateTime: end.toISOString(),
                    $expand: "accessStatsByDay($expand=itemActivityStats)",
                });
                const body = yield json(`https://${host}/_api/v2.1/sites/${siteKey}/lists/${listId}/items/${itemId}/oneDrive.getAggregatedAnalytics?${params.toString()}`, "Analytics.itemDaily");
                const stats = ((_a = body.accessStatsByDay) !== null && _a !== void 0 ? _a : {});
                return toDays(Array.isArray(stats.itemActivityStats) ? stats.itemActivityStats : []);
            });
        },
    };
    return api;
}
function rowsFrom(body) {
    var _a;
    if (Array.isArray(body.value))
        return body.value;
    const stats = ((_a = body.accessStatsByDay) !== null && _a !== void 0 ? _a : {});
    return Array.isArray(stats.itemActivityStats) ? stats.itemActivityStats : [];
}
function toDays(rows) {
    const byDay = new Map();
    rows.forEach((row) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const raw = String((_c = (_b = (_a = row.startDateTime) !== null && _a !== void 0 ? _a : row.activityDateTime) !== null && _b !== void 0 ? _b : row.date) !== null && _c !== void 0 ? _c : "");
        const date = raw.slice(0, 10);
        if (!date)
            return;
        const access = ((_d = row.access) !== null && _d !== void 0 ? _d : row);
        const entry = (_e = byDay.get(date)) !== null && _e !== void 0 ? _e : { date, views: 0, unique: 0, timeSpentSeconds: 0 };
        entry.views = entry.views + Number((_f = access.actionCount) !== null && _f !== void 0 ? _f : 0);
        entry.unique = entry.unique + Number((_g = access.actorCount) !== null && _g !== void 0 ? _g : 0);
        entry.timeSpentSeconds = entry.timeSpentSeconds + Number((_h = access.timeSpentInSeconds) !== null && _h !== void 0 ? _h : 0);
        byDay.set(date, entry);
    });
    return [...byDay.values()].sort((first, second) => first.date.localeCompare(second.date));
}
function windowTotals(window) {
    var _a, _b, _c, _d;
    const access = ((_a = window === null || window === void 0 ? void 0 : window.access) !== null && _a !== void 0 ? _a : {});
    return {
        views: Number((_b = access.actionCount) !== null && _b !== void 0 ? _b : 0),
        unique: Number((_c = access.actorCount) !== null && _c !== void 0 ? _c : 0),
        timeSpentSeconds: Number((_d = access.timeSpentInSeconds) !== null && _d !== void 0 ? _d : 0),
    };
}
/** An absolute url and a server relative one have to land on the same key. */
export function pathKey(url) {
    const text = String(url !== null && url !== void 0 ? url : "").trim();
    if (!text)
        return "";
    try {
        return decodeURIComponent(new URL(text, window.location.origin).pathname).toLowerCase();
    }
    catch (_a) {
        return text.split("?")[0].toLowerCase();
    }
}
function rowKeys(row) {
    var _a, _b, _c;
    const ids = ((_a = row.sharepointIds) !== null && _a !== void 0 ? _a : {});
    return [String((_b = ids.listItemUniqueId) !== null && _b !== void 0 ? _b : "").toLowerCase(), String((_c = row.id) !== null && _c !== void 0 ? _c : "").toLowerCase(), pathKey(row.webUrl)].filter(Boolean);
}
//# sourceMappingURL=Analytics.api.js.map