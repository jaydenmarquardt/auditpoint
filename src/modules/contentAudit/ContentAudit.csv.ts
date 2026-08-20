import { ContentAuditData, ContentEntry } from "@/modules/contentAudit/ContentAudit.types";
import { downloadCsv } from "@/utils/Export.util";

export function entryRow(entry: ContentEntry): Record<string, unknown> {
  return {
    site: entry.siteUrl,
    source: entry.source,
    list: entry.listTitle,
    column: entry.column,
    title: entry.title,
    url: entry.url,
    modified: entry.modified,
    words: entry.words,
    characters: entry.characters,
    paragraphs: entry.paragraphs,
    headings: entry.headings,
    h1: entry.headingsByLevel?.h1 ?? 0,
    h2: entry.headingsByLevel?.h2 ?? 0,
    h3: entry.headingsByLevel?.h3 ?? 0,
    images: entry.images,
    links: entry.links,
    externalLinks: entry.externalLinks,
    emptyLinks: entry.emptyLinks,
    tables: entry.tables,
    embeds: entry.embeds,
    readingMinutes: entry.readingMinutes,
  };
}

export function exportContentAudit(data: Partial<ContentAuditData> | undefined): void {
  downloadCsv("content-audit", (data?.entries ?? []).map(entryRow));
}
