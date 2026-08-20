import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { ContentAuditContent } from "./ContentAudit.content";
import { formatDuration, formatNumber } from "../../utils/Format.util";
export function statTiles(view) {
    const { totals } = view;
    return [
        { iconName: "Documentation", key: "entries", label: ContentAuditContent.stats.entries, value: formatNumber(totals.entries), info: ContentAuditContent.tileInfo.entries },
        { iconName: "Page", key: "pages", label: ContentAuditContent.stats.pages, value: formatNumber(totals.pages), info: ContentAuditContent.tileInfo.pages },
        { iconName: "BulletedList", key: "items", label: ContentAuditContent.stats.items, value: formatNumber(totals.items), info: ContentAuditContent.tileInfo.items },
        { iconName: "NumberField", key: "words", label: ContentAuditContent.stats.words, value: formatNumber(totals.words), info: ContentAuditContent.tileInfo.words },
        { iconName: "Calculator", key: "average", label: ContentAuditContent.stats.average, value: formatNumber(totals.averageWords), info: ContentAuditContent.tileInfo.average },
        {
            key: "averageReading",
            label: ContentAuditContent.stats.averageReading,
            value: `${totals.averageReadingMinutes} min`,
            info: ContentAuditContent.tileInfo.averageReading,
        },
        {
            iconName: "ReadingMode", key: "reading",
            label: ContentAuditContent.stats.reading,
            value: formatDuration(totals.readingMinutes * 60 * 1000),
            info: ContentAuditContent.tileInfo.reading,
        },
        { iconName: "Header", key: "headings", label: ContentAuditContent.stats.headings, value: formatNumber(totals.headings), info: ContentAuditContent.tileInfo.headings },
        { iconName: "Photo2", key: "images", label: ContentAuditContent.stats.images, value: formatNumber(totals.images), info: ContentAuditContent.tileInfo.images },
        { iconName: "Link", key: "links", label: ContentAuditContent.stats.links, value: formatNumber(totals.links), info: ContentAuditContent.tileInfo.links },
        { iconName: "Globe", key: "external", label: ContentAuditContent.stats.external, value: formatNumber(totals.externalLinks), info: ContentAuditContent.tileInfo.external },
        {
            iconName: "FieldEmpty", key: "empty",
            label: ContentAuditContent.stats.empty,
            value: formatNumber(totals.emptyLinks),
            tone: "warning",
            info: ContentAuditContent.tileInfo.empty,
        },
        { iconName: "Table", key: "tables", label: ContentAuditContent.stats.tables, value: formatNumber(totals.tables), info: ContentAuditContent.tileInfo.tables },
        { iconName: "Embed", key: "embeds", label: ContentAuditContent.stats.embeds, value: formatNumber(totals.embeds), info: ContentAuditContent.tileInfo.embeds },
        {
            iconName: "TextField", key: "thin",
            label: ContentAuditContent.stats.thin,
            value: formatNumber(totals.thin),
            tone: "warning",
            info: ContentAuditContent.tileInfo.thin,
        },
        {
            iconName: "Header", key: "noHeadings",
            label: ContentAuditContent.stats.noHeadings,
            value: formatNumber(totals.noHeadings),
            tone: "warning",
            info: ContentAuditContent.tileInfo.noHeadings,
        },
    ];
}
export const ContentAuditStats = ({ view }) => (React.createElement(StatGrid, { tiles: statTiles(view), columns: 5 }));
//# sourceMappingURL=ContentAudit.stats.js.map