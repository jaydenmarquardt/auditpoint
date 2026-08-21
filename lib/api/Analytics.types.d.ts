/** One window of activity as SharePoint reports it. */
export interface ViewTotals {
    views: number;
    /** Distinct viewers, counted per item: one person reading three pages is three. */
    unique: number;
    timeSpentSeconds: number;
}
export interface ItemAnalytics {
    /** Key the bulk rows are matched on: unique id, graph id or url path. */
    keys: string[];
    allTime: ViewTotals;
    last7: ViewTotals;
    last30: ViewTotals;
    last90: ViewTotals;
}
export interface ActivityDay {
    /** ISO date, midnight. */
    date: string;
    views: number;
    unique: number;
    timeSpentSeconds: number;
}
export interface ActivityHour {
    /** Hour of the day, 0-23, in the browser's timezone. */
    hour: number;
    views: number;
    unique: number;
}
export interface SiteIdentifiers {
    host: string;
    siteId: string;
    webId: string;
    /** `host,siteId,webId`, which is what the v2.1 endpoints key sites by. */
    siteKey: string;
}
//# sourceMappingURL=Analytics.types.d.ts.map