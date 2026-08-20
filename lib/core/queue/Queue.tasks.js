import { __awaiter } from "tslib";
import { registerTaskRunner } from "./Queue.store";
import { SitePages } from "../../api/SitePages.api";
import { Reports } from "../../api/Reports.api";
import { getContext } from "../../api/Sp.api";
import { getSettings } from "../../api/Settings.api";
import { createId } from "../../utils/Id.util";
export const TASK_PAGE_INVENTORY = "page-inventory";
export function registerBuiltInTasks() {
    registerTaskRunner(TASK_PAGE_INVENTORY, (payload, controls) => __awaiter(this, void 0, void 0, function* () {
        controls.report({ message: "Reading Site Pages…" });
        const pages = yield SitePages().getItems({ top: payload.maxPages });
        if (controls.isCancelled())
            return { pageCount: pages.length };
        controls.report({ ratio: 0.7, message: `${pages.length} pages` });
        if (!payload.saveReport)
            return { pageCount: pages.length };
        const iso = new Date().toISOString();
        const envelope = {
            id: createId("inv").replace(/^inv-/, ""),
            kind: TASK_PAGE_INVENTORY,
            title: "Page inventory",
            version: "1.0.0",
            schemaVersion: 1,
            config: { maxPages: payload.maxPages },
            createdIso: iso,
            updatedIso: iso,
            createdBy: getContext().pageContext.user.displayName,
            createdByLogin: getContext().pageContext.user.loginName,
            sites: getSettings().sites.map((site) => site.url),
            status: "complete",
            stages: [{ key: "read", label: "Read pages", status: "succeeded", processed: pages.length }],
            issues: [],
            logs: [],
            data: { pages },
        };
        controls.report({ ratio: 0.9, message: "Saving report…" });
        const saved = yield Reports().save(envelope);
        return { pageCount: pages.length, reportUrl: saved.serverRelativeUrl };
    }));
}
//# sourceMappingURL=Queue.tasks.js.map