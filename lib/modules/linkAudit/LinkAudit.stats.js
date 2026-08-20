import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { LinkAuditContent } from "./LinkAudit.content";
import { formatNumber } from "../../utils/Format.util";
export function statTiles(view) {
    const { totals } = view;
    return [
        { key: "items", label: LinkAuditContent.stats.items, value: formatNumber(totals.items), info: LinkAuditContent.tileInfo.items },
        { key: "pages", label: LinkAuditContent.stats.pages, value: formatNumber(totals.pages), info: LinkAuditContent.tileInfo.pages },
        { key: "listItems", label: LinkAuditContent.stats.listItems, value: formatNumber(totals.listItems), info: LinkAuditContent.tileInfo.listItems },
        { key: "documents", label: LinkAuditContent.stats.documents, value: formatNumber(totals.documents), info: LinkAuditContent.tileInfo.documents },
        { key: "pdfs", label: LinkAuditContent.stats.pdfs, value: formatNumber(totals.pdfs), info: LinkAuditContent.tileInfo.pdfs },
        { key: "docx", label: LinkAuditContent.stats.docx, value: formatNumber(totals.docx), info: LinkAuditContent.tileInfo.docx },
        { key: "scanned", label: LinkAuditContent.stats.scanned, value: formatNumber(totals.scanned), info: LinkAuditContent.tileInfo.scanned },
        { key: "documentsRead", label: LinkAuditContent.stats.documentsRead, value: formatNumber(totals.documentsRead), info: LinkAuditContent.tileInfo.documentsRead },
        { key: "outgoing", label: LinkAuditContent.stats.outgoing, value: formatNumber(totals.outgoing), info: LinkAuditContent.tileInfo.outgoing },
        { key: "incoming", label: LinkAuditContent.stats.incoming, value: formatNumber(totals.incoming), info: LinkAuditContent.tileInfo.incoming },
        { key: "destinations", label: LinkAuditContent.stats.destinations, value: formatNumber(totals.destinations), info: LinkAuditContent.tileInfo.destinations },
        { key: "webpart", label: LinkAuditContent.stats.webpart, value: formatNumber(totals.webpart), info: LinkAuditContent.tileInfo.webpart },
        { key: "navigation", label: LinkAuditContent.stats.navigation, value: formatNumber(totals.navigation), info: LinkAuditContent.tileInfo.navigation },
        { key: "documentLinks", label: LinkAuditContent.stats.documentLinks, value: formatNumber(totals.documentLinks), info: LinkAuditContent.tileInfo.documentLinks },
        {
            key: "external",
            label: LinkAuditContent.stats.external,
            value: formatNumber(totals.external),
            tone: "warning",
            info: LinkAuditContent.tileInfo.external,
        },
        {
            key: "broken",
            label: LinkAuditContent.stats.broken,
            value: formatNumber(totals.broken),
            tone: "danger",
            badge: totals.broken > 0 ? LinkAuditContent.review : undefined,
            info: LinkAuditContent.tileInfo.broken,
        },
        {
            key: "untested",
            label: LinkAuditContent.stats.untested,
            value: formatNumber(totals.untested),
            tone: "warning",
            info: LinkAuditContent.tileInfo.untested,
        },
        {
            key: "orphans",
            label: LinkAuditContent.stats.orphans,
            value: formatNumber(totals.orphans),
            info: LinkAuditContent.tileInfo.orphans,
        },
    ];
}
export const LinkAuditStats = ({ view }) => (React.createElement(StatGrid, { tiles: statTiles(view), columns: 6 }));
//# sourceMappingURL=LinkAudit.stats.js.map