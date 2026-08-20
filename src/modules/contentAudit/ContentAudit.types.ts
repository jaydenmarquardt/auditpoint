export interface ContentAuditConfig {
  maxPages: number;
  scanListItems: boolean;
  columnNames: string;
  autoDetectColumns: boolean;
  maxItemsPerList: number;
  maxLists: number;
  thinWordCount: number;
}

export interface ContentMetrics {
  words: number;
  characters: number;
  paragraphs: number;
  headings: number;
  headingsByLevel: Record<string, number>;
  images: number;
  imagesWithoutAlt: number;
  links: number;
  externalLinks: number;
  internalLinks: number;
  mailtoLinks: number;
  emptyLinks: number;
  tables: number;
  listBlocks: number;
  embeds: number;
  readingMinutes: number;
}

export interface ContentEntry extends ContentMetrics {
  siteUrl: string;
  source: "page" | "item";
  listTitle: string;
  itemId: number;
  column: string;
  title: string;
  url: string;
  modified: string;
  contentType: string;
}

export interface ContentAuditData {
  entries: ContentEntry[];
  columnsScanned: string[];
  scannedSites: string[];
}

export interface ContentTotals {
  entries: number;
  pages: number;
  items: number;
  words: number;
  characters: number;
  averageWords: number;
  averageReadingMinutes: number;
  headings: number;
  images: number;
  links: number;
  externalLinks: number;
  emptyLinks: number;
  tables: number;
  embeds: number;
  thin: number;
  noHeadings: number;
  readingMinutes: number;
}

export interface ContentAuditView {
  totals: ContentTotals;
  wordsByEntry: { label: string; value: number }[];
  headingsByLevel: { label: string; value: number }[];
  byContentType: { label: string; value: number }[];
  wordsByList: { label: string; value: number }[];
  sourceSplit: { label: string; value: number }[];
  issues: ContentEntry[];
}
