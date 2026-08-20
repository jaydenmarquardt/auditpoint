import { ContentAuditConfig, ContentAuditData, ContentAuditView, ContentEntry, ContentTotals } from "@/modules/contentAudit/ContentAudit.types";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";

export function issuesFor(entry: ContentEntry, thinWordCount: number): string[] {
  const issues: string[] = [];
  if (entry.words > 0 && entry.words < thinWordCount) issues.push(ContentAuditContent.issues.thin);
  if (entry.words > 50 && entry.headings === 0) issues.push(ContentAuditContent.issues.noHeadings);
  if (entry.emptyLinks > 0) issues.push(ContentAuditContent.issues.emptyLinks);
  return issues;
}

export function buildView(
  data: Partial<ContentAuditData> | undefined,
  config: ContentAuditConfig
): ContentAuditView {
  const entries = data?.entries ?? [];

  const totals: ContentTotals = {
    entries: entries.length,
    pages: entries.filter((entry) => entry.source === "page").length,
    items: entries.filter((entry) => entry.source === "item").length,
    words: sum(entries, (entry) => entry.words),
    characters: sum(entries, (entry) => entry.characters),
    averageWords: entries.length === 0 ? 0 : Math.round(sum(entries, (entry) => entry.words) / entries.length),
    averageReadingMinutes:
      entries.length === 0
        ? 0
        : Math.round((sum(entries, (entry) => entry.readingMinutes) / entries.length) * 10) / 10,
    headings: sum(entries, (entry) => entry.headings),
    images: sum(entries, (entry) => entry.images),
    links: sum(entries, (entry) => entry.links),
    externalLinks: sum(entries, (entry) => entry.externalLinks),
    emptyLinks: sum(entries, (entry) => entry.emptyLinks),
    tables: sum(entries, (entry) => entry.tables),
    embeds: sum(entries, (entry) => entry.embeds),
    thin: entries.filter((entry) => entry.words > 0 && entry.words < config.thinWordCount).length,
    noHeadings: entries.filter((entry) => entry.words > 50 && entry.headings === 0).length,
    readingMinutes: sum(entries, (entry) => entry.readingMinutes),
  };

  return {
    totals,
    wordsByEntry: [...entries]
      .sort((a, b) => b.words - a.words)
      .slice(0, 12)
      .map((entry) => ({ label: entry.title || entry.url, value: entry.words })),
    headingsByLevel: ["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => ({
      label: level.toUpperCase(),
      value: sum(entries, (entry) => entry.headingsByLevel?.[level] ?? 0),
    })),
    byContentType: countBy(entries.map((entry) => entry.contentType || "Unknown")).slice(0, 12),
    wordsByList: sumBy(entries, (entry) => entry.listTitle).slice(0, 12),
    sourceSplit: [
      { label: ContentAuditContent.sources.page, value: totals.pages },
      { label: ContentAuditContent.sources.item, value: totals.items },
    ],
    issues: entries.filter((entry) => issuesFor(entry, config.thinWordCount).length > 0),
  };
}

function countBy(values: string[]): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function sumBy(entries: ContentEntry[], key: (entry: ContentEntry) => string): { label: string; value: number }[] {
  const totals = new Map<string, number>();
  entries.forEach((entry) => totals.set(key(entry), (totals.get(key(entry)) ?? 0) + entry.words));

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function sum(entries: ContentEntry[], read: (entry: ContentEntry) => number): number {
  return entries.reduce((total, entry) => total + read(entry), 0);
}
