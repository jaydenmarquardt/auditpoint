import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
import { StatTileSpec } from "@/components/Components.types";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { ContentAuditView } from "@/modules/contentAudit/ContentAudit.types";
import { formatDuration, formatNumber } from "@/utils/Format.util";

export function statTiles(view: ContentAuditView): StatTileSpec[] {
  const { totals } = view;

  return [
    { key: "entries", label: ContentAuditContent.stats.entries, value: formatNumber(totals.entries), info: ContentAuditContent.tileInfo.entries },
    { key: "pages", label: ContentAuditContent.stats.pages, value: formatNumber(totals.pages), info: ContentAuditContent.tileInfo.pages },
    { key: "items", label: ContentAuditContent.stats.items, value: formatNumber(totals.items), info: ContentAuditContent.tileInfo.items },
    { key: "words", label: ContentAuditContent.stats.words, value: formatNumber(totals.words), info: ContentAuditContent.tileInfo.words },
    { key: "average", label: ContentAuditContent.stats.average, value: formatNumber(totals.averageWords), info: ContentAuditContent.tileInfo.average },
    {
      key: "averageReading",
      label: ContentAuditContent.stats.averageReading,
      value: `${totals.averageReadingMinutes} min`,
      info: ContentAuditContent.tileInfo.averageReading,
    },
    {
      key: "reading",
      label: ContentAuditContent.stats.reading,
      value: formatDuration(totals.readingMinutes * 60 * 1000),
      info: ContentAuditContent.tileInfo.reading,
    },
    { key: "headings", label: ContentAuditContent.stats.headings, value: formatNumber(totals.headings), info: ContentAuditContent.tileInfo.headings },
    { key: "images", label: ContentAuditContent.stats.images, value: formatNumber(totals.images), info: ContentAuditContent.tileInfo.images },
    { key: "links", label: ContentAuditContent.stats.links, value: formatNumber(totals.links), info: ContentAuditContent.tileInfo.links },
    { key: "external", label: ContentAuditContent.stats.external, value: formatNumber(totals.externalLinks), info: ContentAuditContent.tileInfo.external },
    {
      key: "empty",
      label: ContentAuditContent.stats.empty,
      value: formatNumber(totals.emptyLinks),
      tone: "warning",
      info: ContentAuditContent.tileInfo.empty,
    },
    { key: "tables", label: ContentAuditContent.stats.tables, value: formatNumber(totals.tables), info: ContentAuditContent.tileInfo.tables },
    { key: "embeds", label: ContentAuditContent.stats.embeds, value: formatNumber(totals.embeds), info: ContentAuditContent.tileInfo.embeds },
    {
      key: "thin",
      label: ContentAuditContent.stats.thin,
      value: formatNumber(totals.thin),
      tone: "warning",
      info: ContentAuditContent.tileInfo.thin,
    },
    {
      key: "noHeadings",
      label: ContentAuditContent.stats.noHeadings,
      value: formatNumber(totals.noHeadings),
      tone: "warning",
      info: ContentAuditContent.tileInfo.noHeadings,
    },
  ];
}

export const ContentAuditStats: React.FC<{ view: ContentAuditView }> = ({ view }) => (
  <StatGrid tiles={statTiles(view)} columns={5} />
);
