import { ItemIndexCheck, ListIndexCoverage } from "@/api/Indexing.types";
import { coveragePercent } from "@/modules/indexingAudit/IndexingAudit.logic";
import { IndexingAuditData } from "@/modules/indexingAudit/IndexingAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function listRow(list: ListIndexCoverage): Record<string, unknown> {
  return {
    site: list.siteUrl,
    list: list.title,
    url: list.url,
    template: list.templateName,
    hidden: list.hidden,
    excludedFromSearch: list.noCrawl,
    uniquePermissions: list.hasUniquePermissions,
    items: list.itemCount,
    indexed: list.indexedCount ?? "",
    coveragePercent: coveragePercent(list) ?? "",
    lastItemModified: list.lastItemModified,
    error: list.error ?? "",
  };
}

export function itemRow(item: ItemIndexCheck): Record<string, unknown> {
  return {
    site: item.siteUrl,
    list: item.listTitle,
    title: item.title,
    url: item.url,
    indexed: item.indexed,
    stale: item.stale,
    itemModified: item.itemModified,
    indexedModified: item.indexedModified ?? "",
  };
}

export function exportIndexingAudit(data: Partial<IndexingAuditData> | undefined): void {
  downloadCsv("indexing-audit", (data?.lists ?? []).map(listRow));
}

export function exportIndexChecks(data: Partial<IndexingAuditData> | undefined): void {
  downloadCsv("indexing-item-checks", (data?.items ?? []).map(itemRow));
}
