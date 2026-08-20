import { WebPartInstance } from "@/api/WebParts.types";
import { WebPartAuditData } from "@/modules/webPartAudit/WebPartAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function instanceRow(instance: WebPartInstance): Record<string, unknown> {
  return {
    site: instance.siteUrl,
    page: instance.pageTitle,
    pageUrl: instance.pageUrl,
    webPart: instance.name,
    webPartId: instance.webPartId,
    title: instance.title,
    section: instance.section + 1,
    column: instance.column + 1,
    area: instance.layer === 1 ? "title" : "body",
    properties: instance.propertyKeys.join("|"),
  };
}

export function exportWebPartAudit(data: Partial<WebPartAuditData> | undefined): void {
  downloadCsv("webpart-audit", (data?.instances ?? []).map(instanceRow));
}

export function exportTypeInstances(name: string, instances: WebPartInstance[]): void {
  downloadCsv(
    `webpart-${name.replace(/\s+/g, "-").toLowerCase()}`,
    instances.map((instance) => ({
      page: instance.pageTitle,
      pageUrl: instance.pageUrl,
      title: instance.title,
      section: instance.section + 1,
      column: instance.column + 1,
      properties: JSON.stringify(instance.properties),
    }))
  );
}
