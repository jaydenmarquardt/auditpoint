import { ActivityDay, ActivityHour, ItemAnalytics, SiteIdentifiers } from "./Analytics.types";
/**
 * The analytics the SharePoint page usage panel itself reads: the v2.1 site
 * endpoints, not search. Search reports what it has indexed, which lags and
 * omits anything it was never told about; these numbers are the ones the
 * product shows its own users.
 */
export declare function SiteAnalytics(webUrl?: string): {
    identifiers(): Promise<SiteIdentifiers>;
    listId(title: string): Promise<string>;
    itemTotals(listTitle: string, max: number): Promise<ItemAnalytics[]>;
    activityByDay(days: number): Promise<ActivityDay[]>;
    activityByHour(days: number): Promise<ActivityHour[]>;
    itemDaily(listTitle: string, itemId: number, days: number): Promise<ActivityDay[]>;
};
/** An absolute url and a server relative one have to land on the same key. */
export declare function pathKey(url: unknown): string;
//# sourceMappingURL=Analytics.api.d.ts.map