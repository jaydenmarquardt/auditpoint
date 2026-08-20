import { MODULES } from "../../modules/Modules.registry";
import { TASK_PAGE_INVENTORY } from "../../core/queue/Queue.tasks";
import { ReportsContent } from "./Reports.content";
export function kindLabel(kind) {
    const app = MODULES.find((entry) => { var _a; return ((_a = entry.report) === null || _a === void 0 ? void 0 : _a.kind) === kind; });
    if (app === null || app === void 0 ? void 0 : app.report)
        return app.report.title;
    return kind === TASK_PAGE_INVENTORY ? "Page inventory" : kind;
}
export function kindOptions(reports) {
    const kinds = [...new Set(reports.map((report) => report.kind))];
    return [
        { key: "all", text: ReportsContent.allKinds },
        ...kinds.map((kind) => ({ key: kind, text: kindLabel(kind) })),
    ];
}
export function filterReports(reports, search, kind) {
    const term = search.trim().toLowerCase();
    return reports.filter((report) => {
        if (kind !== "all" && report.kind !== kind)
            return false;
        if (term.length === 0)
            return true;
        return `${report.name} ${report.createdBy} ${kindLabel(report.kind)}`.toLowerCase().indexOf(term) !== -1;
    });
}
/** Unfinished runs are only useful to the person who started them. */
export function visibleReports(reports, userLogin) {
    return reports.filter((report) => report.status === "complete" || ownedBy(report, userLogin));
}
export function ownedBy(report, userLogin) {
    if (!report.createdByLogin || !userLogin)
        return false;
    return report.createdByLogin.toLowerCase() === userLogin.toLowerCase();
}
//# sourceMappingURL=Reports.logic.js.map