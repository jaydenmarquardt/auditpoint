import { SPHttpClient } from "@microsoft/sp-http";
import { getContext, getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { ActivityDay, ActivityHour, ItemAnalytics, SiteIdentifiers, ViewTotals } from "@/api/Analytics.types";

/** Rows per bulk page, and how many pages are ever walked, so one list cannot run away. */
const BULK_PAGE_SIZE = 200;
const MAX_BULK_PAGES = 200;

const identifierCache = new Map<string, SiteIdentifiers>();
const listIdCache = new Map<string, string>();

/**
 * The analytics the SharePoint page usage panel itself reads: the v2.1 site
 * endpoints, not search. Search reports what it has indexed, which lags and
 * omits anything it was never told about; these numbers are the ones the
 * product shows its own users.
 */
export function SiteAnalytics(webUrl?: string): {
  identifiers(): Promise<SiteIdentifiers>;
  listId(title: string): Promise<string>;
  itemTotals(listTitle: string, max: number): Promise<ItemAnalytics[]>;
  activityByDay(days: number): Promise<ActivityDay[]>;
  activityByHour(days: number): Promise<ActivityHour[]>;
  itemDaily(listTitle: string, itemId: number, days: number): Promise<ActivityDay[]>;
} {
  const site = webUrl ?? "";

  const json = async (url: string, label: string): Promise<Record<string, unknown>> =>
    throttled(async () => {
      const response = await getContext().spHttpClient.get(url, SPHttpClient.configurations.v1, {
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

      return (await response.json()) as Record<string, unknown>;
    }, { label });

  const api = {
    async identifiers(): Promise<SiteIdentifiers> {
      const cached = identifierCache.get(site);
      if (cached) return cached;

      const absolute = (webUrl ?? getContext().pageContext.web.absoluteUrl).replace(/\/$/, "");
      const host = new URL(absolute, window.location.origin).hostname;

      const [web, collection] = await Promise.all([
        throttled(() => getSp(webUrl).web.select("Id")(), { label: "Analytics.web" }),
        json(`${absolute}/_api/site?$select=Id`, "Analytics.site"),
      ]);

      const siteId = String((collection as { Id?: string }).Id ?? "");
      const webId = String((web as { Id?: string }).Id ?? "");
      if (!siteId || !webId) throw new Error("Unable to resolve this site's identifiers.");

      const identifiers: SiteIdentifiers = { host, siteId, webId, siteKey: `${host},${siteId},${webId}` };
      identifierCache.set(site, identifiers);
      return identifiers;
    },

    async listId(title: string): Promise<string> {
      const key = `${site}|${title}`;
      const cached = listIdCache.get(key);
      if (cached) return cached;

      const list = (await throttled(() => getSp(webUrl).web.lists.getByTitle(title).select("Id")(), {
        label: "Analytics.listId",
      })) as { Id: string };

      listIdCache.set(key, list.Id);
      return list.Id;
    },

    /**
     * Every item's view windows in a handful of paged requests. Asking each item
     * for its own analytics costs seconds each and never finishes on a real site.
     * The trade is detail: this gives the windows, not the daily rows.
     */
    async itemTotals(listTitle: string, max: number): Promise<ItemAnalytics[]> {
      const { host, siteKey } = await api.identifiers();
      const listId = await api.listId(listTitle);
      const expand = encodeURIComponent("analytics($expand=allTime,lastSevenDays,lastThirtyDays,lastNinetyDays)");

      const totals: ItemAnalytics[] = [];
      let url = `https://${host}/_api/v2.1/sites/${siteKey}/lists/${listId}/items?$expand=${expand}&$top=${BULK_PAGE_SIZE}`;

      for (let page = 0; page < MAX_BULK_PAGES && url && totals.length < max; page = page + 1) {
        const body = await json(url, "Analytics.bulk");
        const rows = Array.isArray(body.value) ? (body.value as Record<string, unknown>[]) : [];

        rows.forEach((row) => {
          const analytics = (row.analytics ?? {}) as Record<string, unknown>;

          totals.push({
            keys: rowKeys(row),
            allTime: windowTotals(analytics.allTime),
            last7: windowTotals(analytics.lastSevenDays),
            last30: windowTotals(analytics.lastThirtyDays),
            last90: windowTotals(analytics.lastNinetyDays),
          });
        });

        url = String(body["@odata.nextLink"] ?? body["@nextLink"] ?? "");
      }

      return totals;
    },

    /**
     * Daily activity for the whole site. Tenants disagree about which shape
     * exists, so each is tried in turn and the first that answers wins.
     */
    async activityByDay(days: number): Promise<ActivityDay[]> {
      const { host, siteKey } = await api.identifiers();
      const end = new Date();
      const start = new Date(end.getTime() - Math.max(1, days) * 86400000);
      const range = `startDateTime='${start.toISOString()}',endDateTime='${end.toISOString()}'`;
      const base = `https://${host}/_api/v2.1/sites/${siteKey}`;

      const candidates = [
        `${base}/analytics/getActivitiesByInterval(${range},interval='day')`,
        `${base}/getActivitiesByInterval(${range},interval='day')`,
        `${base}/oneDrive.getAggregatedAnalytics?startDateTime=${start.toISOString()}&endDateTime=${end.toISOString()}&$expand=${encodeURIComponent(
          "accessStatsByDay($expand=itemActivityStats)"
        )}`,
      ];

      for (const url of candidates) {
        try {
          return toDays(rowsFrom(await json(url, "Analytics.activity")));
        } catch {
          // Endpoint missing on this tenant, so try the next shape.
        }
      }

      return [];
    },

    /** Hourly buckets, where the tenant answers at that interval. */
    async activityByHour(days: number): Promise<ActivityHour[]> {
      const { host, siteKey } = await api.identifiers();
      const end = new Date();
      const start = new Date(end.getTime() - Math.max(1, days) * 86400000);
      const range = `startDateTime='${start.toISOString()}',endDateTime='${end.toISOString()}'`;

      try {
        const body = await json(
          `https://${host}/_api/v2.1/sites/${siteKey}/analytics/getActivitiesByInterval(${range},interval='hour')`,
          "Analytics.hourly"
        );

        const byHour = new Map<number, ActivityHour>();

        rowsFrom(body).forEach((row) => {
          const stamp = new Date(String(row.startDateTime ?? row.activityDateTime ?? row.date ?? ""));
          if (!Number.isFinite(stamp.getTime())) return;

          const access = (row.access ?? row) as Record<string, unknown>;
          const entry = byHour.get(stamp.getHours()) ?? { hour: stamp.getHours(), views: 0, unique: 0 };

          entry.views = entry.views + Number(access.actionCount ?? 0);
          entry.unique = entry.unique + Number(access.actorCount ?? 0);
          byHour.set(entry.hour, entry);
        });

        return [...byHour.values()].sort((first, second) => first.hour - second.hour);
      } catch {
        return [];
      }
    },

    /** Daily rows for one item, which is what the bulk call cannot give. */
    async itemDaily(listTitle: string, itemId: number, days: number): Promise<ActivityDay[]> {
      const { host, siteKey } = await api.identifiers();
      const listId = await api.listId(listTitle);
      const end = new Date();
      const start = new Date(end.getTime() - Math.max(1, days) * 86400000);

      const params = new URLSearchParams({
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        $expand: "accessStatsByDay($expand=itemActivityStats)",
      });

      const body = await json(
        `https://${host}/_api/v2.1/sites/${siteKey}/lists/${listId}/items/${itemId}/oneDrive.getAggregatedAnalytics?${params.toString()}`,
        "Analytics.itemDaily"
      );

      const stats = (body.accessStatsByDay ?? {}) as Record<string, unknown>;
      return toDays(Array.isArray(stats.itemActivityStats) ? (stats.itemActivityStats as Record<string, unknown>[]) : []);
    },
  };

  return api;
}

function rowsFrom(body: Record<string, unknown>): Record<string, unknown>[] {
  if (Array.isArray(body.value)) return body.value as Record<string, unknown>[];

  const stats = (body.accessStatsByDay ?? {}) as Record<string, unknown>;
  return Array.isArray(stats.itemActivityStats) ? (stats.itemActivityStats as Record<string, unknown>[]) : [];
}

function toDays(rows: Record<string, unknown>[]): ActivityDay[] {
  const byDay = new Map<string, ActivityDay>();

  rows.forEach((row) => {
    const raw = String(row.startDateTime ?? row.activityDateTime ?? row.date ?? "");
    const date = raw.slice(0, 10);
    if (!date) return;

    const access = (row.access ?? row) as Record<string, unknown>;
    const entry = byDay.get(date) ?? { date, views: 0, unique: 0, timeSpentSeconds: 0 };

    entry.views = entry.views + Number(access.actionCount ?? 0);
    entry.unique = entry.unique + Number(access.actorCount ?? 0);
    entry.timeSpentSeconds = entry.timeSpentSeconds + Number(access.timeSpentInSeconds ?? 0);
    byDay.set(date, entry);
  });

  return [...byDay.values()].sort((first, second) => first.date.localeCompare(second.date));
}

function windowTotals(window: unknown): ViewTotals {
  const access = ((window as Record<string, unknown>)?.access ?? {}) as Record<string, unknown>;

  return {
    views: Number(access.actionCount ?? 0),
    unique: Number(access.actorCount ?? 0),
    timeSpentSeconds: Number(access.timeSpentInSeconds ?? 0),
  };
}

/** An absolute url and a server relative one have to land on the same key. */
export function pathKey(url: unknown): string {
  const text = String(url ?? "").trim();
  if (!text) return "";

  try {
    return decodeURIComponent(new URL(text, window.location.origin).pathname).toLowerCase();
  } catch {
    return text.split("?")[0].toLowerCase();
  }
}

function rowKeys(row: Record<string, unknown>): string[] {
  const ids = (row.sharepointIds ?? {}) as Record<string, unknown>;

  return [String(ids.listItemUniqueId ?? "").toLowerCase(), String(row.id ?? "").toLowerCase(), pathKey(row.webUrl)].filter(
    Boolean
  );
}
