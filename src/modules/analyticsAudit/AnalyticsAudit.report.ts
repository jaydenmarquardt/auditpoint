import { SiteLists } from "@/api/Lists.api";
import { getSp } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { pathKey, SiteAnalytics } from "@/api/Analytics.api";
import { ItemAnalytics } from "@/api/Analytics.types";
import { ReportDefinition } from "@/core/report/Report.types";
import { AnalyticsAuditConfig, AnalyticsAuditData, AnalyticsEntry } from "@/modules/analyticsAudit/AnalyticsAudit.types";
import { toErrorMessage } from "@/utils/Guard.util";

export const ANALYTICS_AUDIT_KIND = "analytics-audit";

/** Pages sampled for daily rows when the site wide endpoints stay silent. */
const SAMPLE_PAGES = 25;

interface ItemRow {
  Id: number;
  Title?: string;
  FileLeafRef?: string;
  FileRef?: string;
  Modified?: string;
  GUID?: string;
  [column: string]: unknown;
}

export const analyticsAuditReport: ReportDefinition<AnalyticsAuditData, AnalyticsAuditConfig> = {
  kind: ANALYTICS_AUDIT_KIND,
  title: "Analytics audit",
  description:
    "Reads view counts, unique viewers and time spent for every page and file from the site analytics endpoints, then groups them by folder, area, file type and day.",
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
      description:
        "Daily history costs one request per page, so this stays at zero unless the per page charts are needed. The most viewed pages are taken first.",
    },
  ],

  stages: [
    {
      key: "pages",
      work: "both",
      label: "Read pages and their view counts",
      async run(context) {
        const analytics = SiteAnalytics(context.siteUrl);
        const entries = keep(context, "page");

        const items = await readItems(context.siteUrl, "Site Pages", context.config.maxPages, context.config.orgUnitColumn);
        const totals = index(await analytics.itemTotals("Site Pages", context.config.maxPages));

        items.forEach((item) => entries.push(toEntry(context.siteUrl, "page", "Site Pages", item, totals, context.config)));

        context.data.entries = entries;
        context.data.scannedSites = [...new Set([...(context.data.scannedSites ?? []), context.siteUrl])];
        context.log(`${items.length} pages, ${totals.size} analytics rows matched`);
        context.progress(items.length, items.length);
      },
    },

    {
      key: "files",
      work: "both",
      label: "Read files and their view counts",
      async run(context) {
        if (!context.config.scanFiles) {
          context.progress(0, 0);
          return;
        }

        const analytics = SiteAnalytics(context.siteUrl);
        const libraries = (await SiteLists(context.siteUrl).getAll(false))
          .filter((list) => list.kind === "library" && list.title !== "Site Pages" && list.itemCount > 0)
          .slice(0, context.config.maxLists);

        const start = typeof context.cursor === "number" ? context.cursor : 0;
        const entries = start === 0 ? keep(context, "file") : context.data.entries ?? [];

        for (let index_ = start; index_ < libraries.length; index_ = index_ + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index_);
            context.data.entries = entries;
            return;
          }

          const library = libraries[index_];

          try {
            const items = await readItems(
              context.siteUrl,
              library.title,
              context.config.maxFilesPerLibrary,
              context.config.orgUnitColumn
            );
            const totals = index(await analytics.itemTotals(library.title, context.config.maxFilesPerLibrary));

            items.forEach((item) =>
              entries.push(toEntry(context.siteUrl, "file", library.title, item, totals, context.config))
            );
          } catch (error) {
            context.issue({ target: library.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index_ + 1);
          context.progress(index_ + 1, libraries.length);
        }

        context.data.entries = entries;
      },
    },

    {
      key: "activity",
      work: "network",
      label: "Read site activity by day",
      async run(context) {
        const analytics = SiteAnalytics(context.siteUrl);
        const days = await analytics.activityByDay(context.config.days);

        if (days.length > 0) {
          context.data.activity = days;
          context.data.activitySampled = false;
        } else {
          // No site wide endpoint answered, so the days are summed from the busiest
          // pages instead and the report says so on screen.
          const pages = (context.data.entries ?? [])
            .filter((entry) => entry.kind === "page")
            .sort((first, second) => second.last90.views - first.last90.views)
            .slice(0, SAMPLE_PAGES);

          const sampled = new Map<string, { date: string; views: number; unique: number; timeSpentSeconds: number }>();

          for (const page of pages) {
            await context.waitIfPaused();
            if (context.isCancelled()) break;

            try {
              (await analytics.itemDaily(page.listTitle, page.itemId, context.config.days)).forEach((day) => {
                const row = sampled.get(day.date) ?? { date: day.date, views: 0, unique: 0, timeSpentSeconds: 0 };
                row.views = row.views + day.views;
                row.unique = row.unique + day.unique;
                row.timeSpentSeconds = row.timeSpentSeconds + day.timeSpentSeconds;
                sampled.set(day.date, row);
              });
            } catch (error) {
              context.issue({ target: page.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
            }
          }

          context.data.activity = [...sampled.values()].sort((first, second) => first.date.localeCompare(second.date));
          context.data.activitySampled = true;
        }

        context.data.hourly = context.config.readHourly ? await analytics.activityByHour(context.config.days) : [];
        context.log(
          `${(context.data.activity ?? []).length} days${context.data.activitySampled ? " (sampled from pages)" : ""}`
        );
        context.progress(1, 1);
      },
    },

    {
      key: "daily",
      work: "network",
      label: "Pre-load daily detail for top pages",
      async run(context) {
        if (context.config.dailyDetailPages <= 0) {
          context.progress(0, 0);
          return;
        }

        const analytics = SiteAnalytics(context.siteUrl);
        const entries = context.data.entries ?? [];
        const targets = entries
          .filter((entry) => entry.kind === "page" && entry.siteUrl === context.siteUrl && !entry.daily)
          .sort((first, second) => second.last90.views - first.last90.views)
          .slice(0, context.config.dailyDetailPages);

        const start = typeof context.cursor === "number" ? context.cursor : 0;

        for (let index_ = start; index_ < targets.length; index_ = index_ + 1) {
          await context.waitIfPaused();
          if (context.isCancelled()) {
            context.setCursor(index_);
            return;
          }

          const page = targets[index_];

          try {
            page.daily = await analytics.itemDaily(page.listTitle, page.itemId, context.config.days);
          } catch (error) {
            context.issue({ target: page.title, code: statusOf(error) ?? "error", message: toErrorMessage(error) });
          }

          context.setCursor(index_ + 1);
          context.progress(index_ + 1, targets.length);
        }

        context.data.entries = entries;
      },
    },

    {
      key: "summarise",
      work: "client",
      label: "Summarise",
      async run(context) {
        const entries = context.data.entries ?? [];
        const views = entries.reduce((total, entry) => total + entry.last90.views, 0);

        context.log(`${entries.length} items measured, ${views} views in the last 90 days`);
        context.progress(entries.length, entries.length);
      },
    },
  ],
};

/** Items carry the identity; the analytics rows carry the numbers. */
async function readItems(
  siteUrl: string,
  listTitle: string,
  top: number,
  orgUnitColumn: string
): Promise<ItemRow[]> {
  const select = ["Id", "Title", "FileLeafRef", "FileRef", "Modified", "GUID"];
  if (orgUnitColumn.trim()) select.push(orgUnitColumn.trim());

  try {
    return (await throttled(
      () => getSp(siteUrl).web.lists.getByTitle(listTitle).items.select(...select).top(top)(),
      { label: "Analytics.items" }
    )) as ItemRow[];
  } catch {
    // A missing org unit column fails the whole request, so it is dropped and retried.
    return (await throttled(
      () =>
        getSp(siteUrl)
          .web.lists.getByTitle(listTitle)
          .items.select("Id", "Title", "FileLeafRef", "FileRef", "Modified", "GUID")
          .top(top)(),
      { label: "Analytics.items" }
    )) as ItemRow[];
  }
}

function index(rows: ItemAnalytics[]): Map<string, ItemAnalytics> {
  const byKey = new Map<string, ItemAnalytics>();
  rows.forEach((row) => row.keys.forEach((key) => byKey.set(key, row)));
  return byKey;
}

const EMPTY = { views: 0, unique: 0, timeSpentSeconds: 0 };

function toEntry(
  siteUrl: string,
  kind: AnalyticsEntry["kind"],
  listTitle: string,
  item: ItemRow,
  totals: Map<string, ItemAnalytics>,
  config: AnalyticsAuditConfig
): AnalyticsEntry {
  const url = String(item.FileRef ?? "");
  const match =
    totals.get(String(item.GUID ?? "").toLowerCase()) ?? totals.get(pathKey(url)) ?? undefined;

  const name = String(item.FileLeafRef ?? "");

  return {
    siteUrl,
    kind,
    listTitle,
    itemId: Number(item.Id),
    title: String(item.Title ?? name ?? url),
    url,
    folder: folderOf(url),
    orgUnit: orgUnitOf(item, config.orgUnitColumn),
    extension: name.split(".").pop()?.toLowerCase() ?? "",
    modified: String(item.Modified ?? ""),
    allTime: match?.allTime ?? EMPTY,
    last7: match?.last7 ?? EMPTY,
    last30: match?.last30 ?? EMPTY,
    last90: match?.last90 ?? EMPTY,
  };
}

/** The folder a page sits in, which is how most sites are actually organised. */
function folderOf(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : "";
}

function orgUnitOf(item: ItemRow, column: string): string {
  const value = column.trim() ? item[column.trim()] : undefined;
  if (!value) return "";

  if (typeof value === "object") {
    const lookup = value as { Title?: string; Label?: string };
    return String(lookup.Title ?? lookup.Label ?? "");
  }

  return String(value);
}

function keep(
  context: { data: Partial<AnalyticsAuditData>; siteUrl: string },
  kind: AnalyticsEntry["kind"]
): AnalyticsEntry[] {
  return (context.data.entries ?? []).filter(
    (entry) => !(entry.siteUrl === context.siteUrl && entry.kind === kind)
  );
}

function statusOf(error: unknown): number | undefined {
  const candidate = error as { status?: number; httpStatus?: number };
  return candidate?.status ?? candidate?.httpStatus;
}
