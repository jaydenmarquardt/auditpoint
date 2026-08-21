import { downloadCsv } from "@/utils/Export.util";
import { AnalyticsAuditData } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export function exportAnalyticsAudit(data: Partial<AnalyticsAuditData> | undefined): void {
  const rows = (data?.entries ?? []).map((entry) => ({
    site: entry.siteUrl,
    kind: entry.kind,
    list: entry.listTitle,
    id: entry.itemId,
    title: entry.title,
    url: entry.url,
    folder: entry.folder,
    orgUnit: entry.orgUnit,
    extension: entry.extension,
    modified: entry.modified,
    views7: entry.last7.views,
    viewers7: entry.last7.unique,
    seconds7: entry.last7.timeSpentSeconds,
    views30: entry.last30.views,
    viewers30: entry.last30.unique,
    seconds30: entry.last30.timeSpentSeconds,
    views90: entry.last90.views,
    viewers90: entry.last90.unique,
    seconds90: entry.last90.timeSpentSeconds,
    viewsAllTime: entry.allTime.views,
    viewersAllTime: entry.allTime.unique,
    secondsAllTime: entry.allTime.timeSpentSeconds,
  }));

  downloadCsv(`analytics-audit-${new Date().toISOString().substring(0, 10)}`, rows);
}
