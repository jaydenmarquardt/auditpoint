import * as React from "react";
import { StatGrid } from "@/components/layout/StatGrid";
import { StatTileSpec } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { LinkAuditView } from "@/modules/linkAudit/LinkAudit.types";
import { formatNumber } from "@/utils/Format.util";

export interface StatSection {
  key: string;
  title: string;
  tiles: StatTileSpec[];
}

/**
 * Four questions, four grids: what was read, where the links point, how they were
 * written, and what is wrong. One flat wall of twenty numbers answered none of them.
 */
export function statSections(view: LinkAuditView): StatSection[] {
  const { totals, linkTypes } = view;

  return [
    {
      key: "scanned",
      title: LinkAuditContent.sections.scanned,
      tiles: [
        { key: "items", label: LinkAuditContent.stats.items, value: formatNumber(totals.items), iconName: "Documentation", info: LinkAuditContent.tileInfo.items },
        { key: "pages", label: LinkAuditContent.stats.pages, value: formatNumber(totals.pages), iconName: "Page", info: LinkAuditContent.tileInfo.pages },
        { key: "listItems", label: LinkAuditContent.stats.listItems, value: formatNumber(totals.listItems), iconName: "BulletedList", info: LinkAuditContent.tileInfo.listItems },
        { key: "documents", label: LinkAuditContent.stats.documents, value: formatNumber(totals.documents), iconName: "TextDocument", info: LinkAuditContent.tileInfo.documents },
        { key: "attachments", label: LinkAuditContent.stats.attachments, value: formatNumber(totals.attachments), iconName: "Attach", info: LinkAuditContent.tileInfo.attachments },
        { key: "pdfs", label: LinkAuditContent.stats.pdfs, value: formatNumber(totals.pdfs), iconName: "PDF", info: LinkAuditContent.tileInfo.pdfs },
        { key: "docx", label: LinkAuditContent.stats.docx, value: formatNumber(totals.docx), iconName: "WordDocument", info: LinkAuditContent.tileInfo.docx },
        { key: "configFiles", label: LinkAuditContent.stats.configFiles, value: formatNumber(totals.configFiles), iconName: "Settings", info: LinkAuditContent.tileInfo.configFiles },
        { key: "scanned", label: LinkAuditContent.stats.scanned, value: formatNumber(totals.scanned), iconName: "CheckList", info: LinkAuditContent.tileInfo.scanned },
        { key: "documentsRead", label: LinkAuditContent.stats.documentsRead, value: formatNumber(totals.documentsRead), iconName: "OpenFile", info: LinkAuditContent.tileInfo.documentsRead },
      ],
    },
    {
      key: "destinations",
      title: LinkAuditContent.sections.destinations,
      tiles: [
        { key: "outgoing", label: LinkAuditContent.stats.outgoing, value: formatNumber(totals.outgoing), iconName: "Link", info: LinkAuditContent.tileInfo.outgoing },
        { key: "destinations", label: LinkAuditContent.stats.destinations, value: formatNumber(totals.destinations), iconName: "Nav2DMapView", info: LinkAuditContent.tileInfo.destinations },
        { key: "incoming", label: LinkAuditContent.stats.incoming, value: formatNumber(totals.incoming), iconName: "PublishContent", info: LinkAuditContent.tileInfo.incoming },
        { key: "thisSite", label: LinkAuditContent.stats.thisSite, value: formatNumber(linkTypes.thisSite), iconName: "Home", info: LinkAuditContent.tileInfo.thisSite },
        { key: "otherSite", label: LinkAuditContent.stats.otherSite, value: formatNumber(linkTypes.otherSite), iconName: "Website", info: LinkAuditContent.tileInfo.otherSite },
        { key: "internal", label: LinkAuditContent.stats.internal, value: formatNumber(linkTypes.internal), iconName: "CityNext", info: LinkAuditContent.tileInfo.internal },
        { key: "external", label: LinkAuditContent.stats.external, value: formatNumber(totals.external), tone: "warning", iconName: "Globe", info: LinkAuditContent.tileInfo.external },
        { key: "documentsLinked", label: LinkAuditContent.stats.documentsLinked, value: formatNumber(linkTypes.document), iconName: "OpenFile", info: LinkAuditContent.tileInfo.documentsLinked },
        { key: "contact", label: LinkAuditContent.stats.contact, value: formatNumber(linkTypes.contact), iconName: "Mail", info: LinkAuditContent.tileInfo.contact },
        { key: "anchor", label: LinkAuditContent.stats.anchor, value: formatNumber(linkTypes.anchor), iconName: "Down", info: LinkAuditContent.tileInfo.anchor },
        { key: "orphans", label: LinkAuditContent.stats.orphans, value: formatNumber(totals.orphans), iconName: "Unlink", info: LinkAuditContent.tileInfo.orphans },
      ],
    },
    {
      key: "written",
      title: LinkAuditContent.sections.written,
      tiles: [
        { key: "webpart", label: LinkAuditContent.stats.webpart, value: formatNumber(totals.webpart), iconName: "Puzzle", info: LinkAuditContent.tileInfo.webpart },
        { key: "navigation", label: LinkAuditContent.stats.navigation, value: formatNumber(totals.navigation), iconName: "GlobalNavButton", info: LinkAuditContent.tileInfo.navigation },
        { key: "megaMenuLinks", label: LinkAuditContent.stats.megaMenuLinks, value: formatNumber(totals.megaMenuLinks), iconName: "CollapseMenu", info: LinkAuditContent.tileInfo.megaMenuLinks },
        { key: "documentLinks", label: LinkAuditContent.stats.documentLinks, value: formatNumber(totals.documentLinks), iconName: "TextDocument", info: LinkAuditContent.tileInfo.documentLinks },
        { key: "attachmentLinks", label: LinkAuditContent.stats.attachmentLinks, value: formatNumber(totals.attachmentLinks), iconName: "Attach", info: LinkAuditContent.tileInfo.attachmentLinks },
        { key: "configLinks", label: LinkAuditContent.stats.configLinks, value: formatNumber(totals.configLinks), iconName: "Settings", info: LinkAuditContent.tileInfo.configLinks },
        { key: "newTab", label: LinkAuditContent.stats.newTab, value: formatNumber(linkTypes.newTab), iconName: "OpenInNewWindow", info: LinkAuditContent.tileInfo.newTab },
        {
          key: "emptyText",
          label: LinkAuditContent.stats.emptyText,
          value: formatNumber(linkTypes.emptyText),
          tone: "warning",
          badge: linkTypes.emptyText > 0 ? LinkAuditContent.review : undefined,
          iconName: "FieldEmpty",
          info: LinkAuditContent.tileInfo.emptyText,
        },
      ],
    },
    {
      key: "health",
      title: LinkAuditContent.sections.health,
      tiles: [
        {
          key: "broken",
          label: LinkAuditContent.stats.broken,
          value: formatNumber(totals.broken),
          tone: "danger",
          badge: totals.broken > 0 ? LinkAuditContent.review : undefined,
          iconName: "RemoveLink",
          info: LinkAuditContent.tileInfo.broken,
        },
        { key: "untested", label: LinkAuditContent.stats.untested, value: formatNumber(totals.untested), tone: "warning", iconName: "Help", info: LinkAuditContent.tileInfo.untested },
        {
          key: "legacy",
          label: LinkAuditContent.stats.legacy,
          value: formatNumber(linkTypes.legacy),
          tone: linkTypes.legacy > 0 ? "danger" : "neutral",
          iconName: "History",
          info: LinkAuditContent.tileInfo.legacy,
        },
        {
          key: "insecure",
          label: LinkAuditContent.stats.insecure,
          value: formatNumber(linkTypes.insecure),
          tone: linkTypes.insecure > 0 ? "warning" : "neutral",
          iconName: "Unlock",
          info: LinkAuditContent.tileInfo.insecure,
        },
        { key: "matched", label: LinkAuditContent.status.matched, value: formatNumber(linkTypes.matched), iconName: "CheckMark", info: LinkAuditContent.tileInfo.destinations },
        {
          key: "unmapped",
          label: LinkAuditContent.status.unmapped,
          value: formatNumber(linkTypes.unmapped),
          tone: "warning",
          iconName: "StatusCircleQuestionMark",
          info: LinkAuditContent.tileInfo.untested,
        },
      ],
    },
  ];
}

export const LinkAuditStats: React.FC<{ view: LinkAuditView }> = ({ view }) => (
  <div style={{ display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 }}>
    {statSections(view).map((section) => (
      <StatGrid key={section.key} title={section.title} tiles={section.tiles} minWidth={180} />
    ))}
  </div>
);
