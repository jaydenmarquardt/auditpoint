import { PublishingItem } from "@/api/Publishing.types";
import { expiryDate, reviewDate, statusLabel } from "@/modules/publishingAudit/PublishingAudit.logic";
import { PublishingAuditData } from "@/modules/publishingAudit/PublishingAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function itemRow(item: PublishingItem): Record<string, unknown> {
  return {
    site: item.siteUrl,
    list: item.listTitle,
    itemId: item.itemId,
    title: item.title,
    url: item.url,
    status: statusLabel(item.moderationStatus),
    createdBy: item.authorTitle,
    created: item.created,
    lastEditedBy: item.editorTitle,
    modified: item.modified,
    version: item.versionLabel,
    versionCount: item.versionCount ?? "",
    versionEditors: (item.versionEditors ?? []).join("|"),
    reviewDate: reviewDate(item) ?? "",
    expiryDate: expiryDate(item) ?? "",
    viewsRecent: item.viewsRecent ?? "",
    viewsLifetime: item.viewsLifetime ?? "",
  };
}

export function exportPublishingAudit(data: Partial<PublishingAuditData> | undefined): void {
  downloadCsv("publishing-audit", (data?.items ?? []).map(itemRow));
}
