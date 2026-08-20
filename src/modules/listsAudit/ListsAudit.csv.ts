import { SiteList } from "@/api/Lists.types";
import { ListsAuditData } from "@/modules/listsAudit/ListsAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function listRow(list: SiteList): Record<string, unknown> {
  return {
    site: list.siteUrl ?? "",
    title: list.title,
    template: list.templateName,
    hidden: list.hidden,
    items: list.itemCount,
    scannedItems: list.scannedItems ?? "",
    folders: list.folderCount ?? "",
    files: list.fileCount ?? "",
    storageBytes: list.storageBytes ?? "",
    contentTypes: (list.contentTypes ?? []).join("|"),
    fileTypes: Object.entries(list.extensions ?? {})
      .map(([extension, stat]) => `${extension}:${stat.count}`)
      .join("|"),
    lastItemModified: list.lastItemModified,
    versioning: list.versioningEnabled,
    uniquePermissions: list.hasUniquePermissions,
    url: list.serverRelativeUrl,
  };
}

export function exportListsAudit(data: Partial<ListsAuditData> | undefined): void {
  downloadCsv("lists-audit", (data?.lists ?? []).map(listRow));
}
