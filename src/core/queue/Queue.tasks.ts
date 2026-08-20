import { registerTaskRunner } from "@/core/queue/Queue.store";
import { SitePages } from "@/api/SitePages.api";
import { SitePage } from "@/api/SitePages.types";
import { Reports } from "@/api/Reports.api";
import { ReportEnvelope } from "@/api/Reports.types";
import { getContext } from "@/api/Sp.api";
import { getSettings } from "@/api/Settings.api";
import { createId } from "@/utils/Id.util";

export const TASK_PAGE_INVENTORY = "page-inventory";

export interface PageInventoryPayload {
  maxPages: number;
  saveReport: boolean;
}

export interface PageInventoryResult {
  pageCount: number;
  reportUrl?: string;
}

export function registerBuiltInTasks(): void {
  registerTaskRunner<PageInventoryPayload, PageInventoryResult>(
    TASK_PAGE_INVENTORY,
    async (payload, controls) => {
      controls.report({ message: "Reading Site Pages…" });

      const pages: SitePage[] = await SitePages().getItems({ top: payload.maxPages });
      if (controls.isCancelled()) return { pageCount: pages.length };

      controls.report({ ratio: 0.7, message: `${pages.length} pages` });
      if (!payload.saveReport) return { pageCount: pages.length };

      const iso = new Date().toISOString();
      const envelope: ReportEnvelope<{ pages: SitePage[] }> = {
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
      const saved = await Reports().save(envelope);

      return { pageCount: pages.length, reportUrl: saved.serverRelativeUrl };
    }
  );
}
