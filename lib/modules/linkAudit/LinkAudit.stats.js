import * as React from "react";
import { StatGrid } from "../../components/layout/StatGrid";
import { Theme } from "../../theme/Theme.api";
import { LinkAuditContent } from "./LinkAudit.content";
import { formatNumber } from "../../utils/Format.util";
/**
 * Four questions, four grids: what was read, where the links point, how they were
 * written, and what is wrong. One flat wall of twenty numbers answered none of them.
 */
export function statSections(view, config) {
    const { totals, linkTypes } = view;
    // A stage that never ran measured nothing, and nothing is not zero.
    const off = (ran) => (config && !ran ? true : undefined);
    return [
        {
            key: "scanned",
            title: LinkAuditContent.sections.scanned,
            tiles: [
                { key: "items", label: LinkAuditContent.stats.items, value: formatNumber(totals.items), iconName: "Documentation", info: LinkAuditContent.tileInfo.items },
                { key: "pages", label: LinkAuditContent.stats.pages, value: formatNumber(totals.pages), iconName: "Page", info: LinkAuditContent.tileInfo.pages },
                { key: "listItems", label: LinkAuditContent.stats.listItems, value: formatNumber(totals.listItems), iconName: "BulletedList", info: LinkAuditContent.tileInfo.listItems },
                { key: "documents", label: LinkAuditContent.stats.documents, value: formatNumber(totals.documents), iconName: "TextDocument", unavailable: off(config === null || config === void 0 ? void 0 : config.includeDocuments), info: LinkAuditContent.tileInfo.documents },
                { key: "attachments", label: LinkAuditContent.stats.attachments, value: formatNumber(totals.attachments), iconName: "Attach", unavailable: off(config === null || config === void 0 ? void 0 : config.scanAttachments), info: LinkAuditContent.tileInfo.attachments },
                { key: "pdfs", label: LinkAuditContent.stats.pdfs, value: formatNumber(totals.pdfs), iconName: "PDF", unavailable: off(config === null || config === void 0 ? void 0 : config.includeDocuments), info: LinkAuditContent.tileInfo.pdfs },
                { key: "docx", label: LinkAuditContent.stats.docx, value: formatNumber(totals.docx), iconName: "WordDocument", unavailable: off(config === null || config === void 0 ? void 0 : config.includeDocuments), info: LinkAuditContent.tileInfo.docx },
                { key: "configFiles", label: LinkAuditContent.stats.configFiles, value: formatNumber(totals.configFiles), iconName: "Settings", unavailable: off(Boolean((config === null || config === void 0 ? void 0 : config.configPaths.trim()) || (config === null || config === void 0 ? void 0 : config.megaMenuPath.trim()))), info: LinkAuditContent.tileInfo.configFiles },
                { key: "scanned", label: LinkAuditContent.stats.scanned, value: formatNumber(totals.scanned), iconName: "CheckList", info: LinkAuditContent.tileInfo.scanned },
                { key: "documentsRead", label: LinkAuditContent.stats.documentsRead, value: formatNumber(totals.documentsRead), iconName: "OpenFile", unavailable: off((config === null || config === void 0 ? void 0 : config.scanDocx) || (config === null || config === void 0 ? void 0 : config.scanPdf) || (config === null || config === void 0 ? void 0 : config.scanHtmlFiles)), info: LinkAuditContent.tileInfo.documentsRead },
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
                { key: "share", label: LinkAuditContent.stats.share, value: formatNumber(linkTypes.share), tone: linkTypes.share > 0 ? "warning" : "neutral", iconName: "Share", info: LinkAuditContent.tileInfo.share },
                { key: "displayForm", label: LinkAuditContent.stats.displayForm, value: formatNumber(linkTypes.displayForm), iconName: "EntryView", info: LinkAuditContent.tileInfo.displayForm },
                { key: "orphans", label: LinkAuditContent.stats.orphans, value: formatNumber(totals.orphans), iconName: "Unlink", info: LinkAuditContent.tileInfo.orphans },
            ],
        },
        {
            key: "written",
            title: LinkAuditContent.sections.written,
            tiles: [
                { key: "webpart", label: LinkAuditContent.stats.webpart, value: formatNumber(totals.webpart), iconName: "Puzzle", unavailable: off(config === null || config === void 0 ? void 0 : config.scanWebParts), info: LinkAuditContent.tileInfo.webpart },
                { key: "navigation", label: LinkAuditContent.stats.navigation, value: formatNumber(totals.navigation), iconName: "GlobalNavButton", unavailable: off(config === null || config === void 0 ? void 0 : config.scanNavigation), info: LinkAuditContent.tileInfo.navigation },
                { key: "megaMenuLinks", label: LinkAuditContent.stats.megaMenuLinks, value: formatNumber(totals.megaMenuLinks), iconName: "CollapseMenu", unavailable: off(Boolean(config === null || config === void 0 ? void 0 : config.megaMenuPath.trim())), info: LinkAuditContent.tileInfo.megaMenuLinks },
                { key: "documentLinks", label: LinkAuditContent.stats.documentLinks, value: formatNumber(totals.documentLinks), iconName: "TextDocument", info: LinkAuditContent.tileInfo.documentLinks },
                { key: "attachmentLinks", label: LinkAuditContent.stats.attachmentLinks, value: formatNumber(totals.attachmentLinks), iconName: "Attach", unavailable: off(config === null || config === void 0 ? void 0 : config.scanAttachments), info: LinkAuditContent.tileInfo.attachmentLinks },
                { key: "configLinks", label: LinkAuditContent.stats.configLinks, value: formatNumber(totals.configLinks), iconName: "Settings", unavailable: off(Boolean(config === null || config === void 0 ? void 0 : config.configPaths.trim())), info: LinkAuditContent.tileInfo.configLinks },
                { key: "newTab", label: LinkAuditContent.stats.newTab, value: formatNumber(linkTypes.newTab), iconName: "OpenInNewWindow", info: LinkAuditContent.tileInfo.newTab },
                { key: "relative", label: LinkAuditContent.stats.relative, value: formatNumber(linkTypes.relative), iconName: "Nav2DMapView", info: LinkAuditContent.tileInfo.relative },
                { key: "absolute", label: LinkAuditContent.stats.absolute, value: formatNumber(linkTypes.absolute), iconName: "Globe", info: LinkAuditContent.tileInfo.absolute },
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
                    key: "checked",
                    label: LinkAuditContent.stats.checked,
                    value: formatNumber(view.checkedUrls),
                    iconName: "TestBeaker",
                    unavailable: off(config === null || config === void 0 ? void 0 : config.checkBrokenLinks),
                    info: LinkAuditContent.tileInfo.checked,
                },
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
                { key: "mapped", label: LinkAuditContent.stats.mapped, value: formatNumber(linkTypes.matched), iconName: "CheckMark", info: LinkAuditContent.tileInfo.mapped },
                {
                    key: "unmapped",
                    label: LinkAuditContent.stats.unmapped,
                    value: formatNumber(linkTypes.unmapped),
                    tone: linkTypes.unmapped > 0 ? "warning" : "neutral",
                    iconName: "StatusCircleQuestionMark",
                    info: LinkAuditContent.tileInfo.unmapped,
                },
            ],
        },
    ];
}
export const LinkAuditStats = ({ view, config }) => (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg, width: "100%", minWidth: 0 } }, statSections(view, config).map((section) => (React.createElement(StatGrid, { key: section.key, title: section.title, tiles: section.tiles, minWidth: 180 })))));
//# sourceMappingURL=LinkAudit.stats.js.map