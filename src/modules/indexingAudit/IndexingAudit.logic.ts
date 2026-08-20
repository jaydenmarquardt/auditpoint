import { ListIndexCoverage } from "@/api/Indexing.types";
import {
  IndexingAuditConfig,
  IndexingAuditData,
  IndexingAuditView,
  IndexingTotals,
} from "@/modules/indexingAudit/IndexingAudit.types";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";

export function coveragePercent(list: ListIndexCoverage): number | undefined {
  if (list.indexedCount === undefined) return undefined;
  if (list.itemCount === 0) return list.indexedCount === 0 ? 100 : 100;
  return Math.min(100, Math.round((list.indexedCount / list.itemCount) * 100));
}

export function buildView(
  data: Partial<IndexingAuditData> | undefined,
  config: IndexingAuditConfig
): IndexingAuditView {
  const lists = data?.lists ?? [];
  const items = data?.items ?? [];
  const crawlable = lists.filter((list) => !list.noCrawl);

  const measured = crawlable.filter((list) => list.indexedCount !== undefined);
  const expectedItems = measured.reduce((sum, list) => sum + list.itemCount, 0);
  const indexedItems = measured.reduce((sum, list) => sum + (list.indexedCount ?? 0), 0);

  const below = measured.filter((list) => {
    const percent = coveragePercent(list);
    return percent !== undefined && list.itemCount > 0 && percent < config.coverageWarningPercent;
  });

  const totals: IndexingTotals = {
    lists: lists.length,
    crawlable: crawlable.length,
    excluded: lists.length - crawlable.length,
    uniquePermissions: lists.filter((list) => list.hasUniquePermissions).length,
    expectedItems,
    indexedItems,
    coveragePercent: expectedItems === 0 ? 0 : Math.min(100, Math.round((indexedItems / expectedItems) * 100)),
    listsBelowTarget: below.length,
    emptyIndex: measured.filter((list) => list.itemCount > 0 && (list.indexedCount ?? 0) === 0).length,
    itemsChecked: items.length,
    itemsMissing: items.filter((item) => !item.indexed).length,
    itemsStale: items.filter((item) => item.indexed && item.stale).length,
    managedProperties: (data?.managedProperties ?? []).length,
    sitesExcluded: (data?.sites ?? []).filter((site) => site.noCrawl).length,
  };

  return {
    totals,
    coverageByList: [...measured]
      .filter((list) => list.itemCount > 0)
      .sort((a, b) => (coveragePercent(a) ?? 0) - (coveragePercent(b) ?? 0))
      .slice(0, 12)
      .map((list) => ({ label: list.title, value: coveragePercent(list) ?? 0 })),
    indexedByList: [...measured]
      .sort((a, b) => (b.indexedCount ?? 0) - (a.indexedCount ?? 0))
      .slice(0, 12)
      .map((list) => ({ label: list.title, value: list.indexedCount ?? 0 })),
    crawlSplit: [
      { label: IndexingAuditContent.crawl.on, value: totals.crawlable },
      { label: IndexingAuditContent.crawl.off, value: totals.excluded },
    ],
    itemSplit: [
      {
        label: IndexingAuditContent.state.indexed,
        value: totals.itemsChecked - totals.itemsMissing - totals.itemsStale,
      },
      { label: IndexingAuditContent.state.missing, value: totals.itemsMissing },
      { label: IndexingAuditContent.state.stale, value: totals.itemsStale },
    ],
    problems: [...below, ...lists.filter((list) => list.noCrawl && list.itemCount > 0)].slice(0, 200),
  };
}
