import { SiteList } from "@/api/Lists.types";
import {
  ListsAuditConfig,
  ListsAuditData,
  ListsAuditTotals,
  ListsAuditView,
} from "@/modules/listsAudit/ListsAudit.types";

export function buildView(
  data: Partial<ListsAuditData> | undefined,
  config: ListsAuditConfig
): ListsAuditView {
  const lists = data?.lists ?? [];
  const visible = lists.filter((list) => !list.hidden);
  const stale = (list: SiteList): boolean => isStale(list, config.staleDays);

  return {
    totals: totalsOf(lists, config.staleDays),
    byTemplate: countBy(visible.map((list) => list.templateName)),
    byContentType: countBy(visible.flatMap((list) => list.contentTypes ?? [])).slice(0, 12),
    byExtension: extensionCounts(visible, "count").slice(0, 12),
    byExtensionSize: extensionCounts(visible, "bytes").slice(0, 12),
    largestByItems: [...visible].sort((a, b) => b.itemCount - a.itemCount).slice(0, 10),
    largest: [...visible]
      .filter((list) => (list.storageBytes ?? 0) > 0)
      .sort((a, b) => (b.storageBytes ?? 0) - (a.storageBytes ?? 0))
      .slice(0, 10),
    stale: visible.filter(stale).sort((a, b) => a.lastItemModified.localeCompare(b.lastItemModified)),
    empty: visible.filter((list) => list.itemCount === 0),
    risky: visible.filter((list) => !list.versioningEnabled || list.hasUniquePermissions),
    storageAvailable: data?.storageAvailable ?? visible.some((list) => (list.storageBytes ?? 0) > 0),
    truncated: lists.filter((list) => list.scanTruncated).length,
  };
}

export function totalsOf(lists: SiteList[], staleDays: number): ListsAuditTotals {
  const visible = lists.filter((list) => !list.hidden);
  const contentTypes = new Set(visible.flatMap((list) => list.contentTypes ?? []));

  return {
    lists: visible.filter((list) => list.kind === "list").length,
    libraries: visible.filter((list) => list.kind === "library").length,
    hidden: lists.length - visible.length,
    items: visible.reduce((sum, list) => sum + list.itemCount, 0),
    files: visible.reduce((sum, list) => sum + (list.fileCount ?? 0), 0),
    folders: visible.reduce((sum, list) => sum + (list.folderCount ?? 0), 0),
    storageBytes: visible.reduce((sum, list) => sum + (list.storageBytes ?? 0), 0),
    contentTypes: contentTypes.size,
    noVersioning: visible.filter((list) => !list.versioningEnabled).length,
    uniquePermissions: visible.filter((list) => list.hasUniquePermissions).length,
    stale: visible.filter((list) => isStale(list, staleDays)).length,
    empty: visible.filter((list) => list.itemCount === 0).length,
  };
}

export function isStale(list: SiteList, staleDays: number): boolean {
  if (!list.lastItemModified) return false;
  return Date.now() - new Date(list.lastItemModified).getTime() > staleDays * 24 * 60 * 60 * 1000;
}

export function daysSince(iso: string): number {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}

const EXTENSION_LABELS: Record<string, string> = {
  "000": "List item",
  aspx: "Page",
};

export function extensionLabel(extension: string): string {
  return EXTENSION_LABELS[extension] ?? `.${extension}`;
}

function extensionCounts(
  lists: SiteList[],
  measure: "count" | "bytes"
): { key: string; label: string; value: number }[] {
  const counts = new Map<string, number>();

  lists.forEach((list) =>
    Object.entries(list.extensions ?? {}).forEach(([extension, stat]) =>
      counts.set(extension, (counts.get(extension) ?? 0) + stat[measure])
    )
  );

  return [...counts.entries()]
    .map(([label, value]) => ({ key: label, label: extensionLabel(label), value }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
}

function countBy(values: string[]): { key: string; label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ key: label, label, value }))
    .sort((a, b) => b.value - a.value);
}
