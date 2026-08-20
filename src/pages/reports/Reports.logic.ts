import { ReportSummary } from "@/api/Reports.types";
import { SelectOption } from "@/components/Components.types";
import { MODULES } from "@/modules/Modules.registry";
import { TASK_PAGE_INVENTORY } from "@/core/queue/Queue.tasks";
import { ReportsContent } from "@/pages/reports/Reports.content";

export function kindLabel(kind: string): string {
  const app = MODULES.find((entry) => entry.report?.kind === kind);
  if (app?.report) return app.report.title;
  return kind === TASK_PAGE_INVENTORY ? "Page inventory" : kind;
}

export function kindOptions(reports: ReportSummary[]): SelectOption[] {
  const kinds = [...new Set(reports.map((report) => report.kind))];
  return [
    { key: "all", text: ReportsContent.allKinds },
    ...kinds.map((kind) => ({ key: kind, text: kindLabel(kind) })),
  ];
}

export function filterReports(reports: ReportSummary[], search: string, kind: string): ReportSummary[] {
  const term = search.trim().toLowerCase();

  return reports.filter((report) => {
    if (kind !== "all" && report.kind !== kind) return false;
    if (term.length === 0) return true;
    return `${report.name} ${report.createdBy} ${kindLabel(report.kind)}`.toLowerCase().indexOf(term) !== -1;
  });
}

/** Unfinished runs are only useful to the person who started them. */
export function visibleReports(reports: ReportSummary[], userLogin: string): ReportSummary[] {
  return reports.filter((report) => report.status === "complete" || ownedBy(report, userLogin));
}

export function ownedBy(report: ReportSummary, userLogin: string): boolean {
  if (!report.createdByLogin || !userLogin) return false;
  return report.createdByLogin.toLowerCase() === userLogin.toLowerCase();
}
