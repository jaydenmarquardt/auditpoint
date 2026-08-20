import { SitePages } from "@/api/SitePages.api";
import { Reports } from "@/api/Reports.api";
import { ReportSummary } from "@/api/Reports.types";
import { toErrorMessage } from "@/utils/Guard.util";
import { checkConfig } from "@/api/Settings.api";

export interface DashboardSummary {
  pageCount: number;
  reports: ReportSummary[];
  latestReport?: ReportSummary;
}

export async function loadDashboardSummary(): Promise<DashboardSummary> {
  const configured = checkConfig().configured;

  const [pages, reports] = await Promise.all([
    SitePages().getItems({ top: 500 }),
    // The reports folder only exists after the first save.
    !configured
      ? Promise.resolve([] as ReportSummary[])
      : Reports()
      .list()
      .catch((error: unknown) => {
        if (/does not exist|not found|404/i.test(toErrorMessage(error, ""))) return [] as ReportSummary[];
        throw error;
      }),
  ]);

  return { pageCount: pages.length, reports, latestReport: reports[0] };
}
