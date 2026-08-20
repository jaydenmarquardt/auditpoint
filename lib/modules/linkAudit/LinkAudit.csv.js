import { downloadCsv, downloadCsvWithSummary } from "../../utils/Export.util";
import { LinkAuditContent } from "./LinkAudit.content";
import { normaliseUrl, statusLabel, summariseLinkTypes, summariseReferences } from "./LinkAudit.logic";
/** One row per link found, rather than one per item: the unresolved ones are the point. */
export function auditRows(references) {
    return references.flatMap((reference) => {
        var _a;
        return ((_a = reference.outgoing) !== null && _a !== void 0 ? _a : []).map((link) => ({
            site: reference.siteUrl,
            sourceKind: reference.kind,
            sourceList: reference.listTitle,
            sourceId: reference.itemId,
            sourceTitle: reference.title,
            sourceUrl: reference.url,
            linkText: link.text,
            linkUrl: link.url,
            linkType: link.linkType,
            linkSource: link.source,
            linkSourceLabel: link.sourceLabel,
            isIntranet: yesNo(link.isIntranet),
            isLegacy: yesNo(link.isLegacy),
            isBroken: statusLabel(link.broken),
            status: link.status || "",
            targetList: link.targetList,
            targetId: link.targetId || "",
            targetTitle: link.targetTitle,
            resolved: yesNo(Boolean(link.targetTitle)),
            isInternal: yesNo(link.isInternal),
            isExternal: yesNo(link.isExternal),
            isInsecure: yesNo(link.isInsecure),
            isAnchor: yesNo(link.isAnchor),
            isContact: yesNo(link.isContact),
            isJS: yesNo(link.isJS),
        }));
    });
}
export function referenceRows(references) {
    return references.map((reference) => {
        var _a, _b, _c;
        return ({
            site: reference.siteUrl,
            kind: reference.kind,
            list: reference.listTitle,
            id: reference.itemId,
            title: reference.title,
            url: reference.url,
            modified: reference.modified,
            scanned: yesNo(reference.scanned),
            incoming: ((_a = reference.incoming) !== null && _a !== void 0 ? _a : []).length,
            outgoing: ((_b = reference.outgoing) !== null && _b !== void 0 ? _b : []).length,
            broken: reference.brokenCount,
            skipped: (_c = reference.skipped) !== null && _c !== void 0 ? _c : "",
        });
    });
}
function summaryBlock(references, destinations) {
    const totals = summariseReferences(references, destinations);
    const types = summariseLinkTypes(references);
    return [
        ["Report", LinkAuditContent.title],
        ["Generated", new Date().toISOString()],
        ["Items", totals.items],
        ["Pages", totals.pages],
        ["List items", totals.listItems],
        ["Documents", totals.documents],
        ["PDFs", totals.pdfs],
        ["Word docs", totals.docx],
        ["Scanned", totals.scanned],
        ["Documents read", totals.documentsRead],
        ["Incoming links", totals.incoming],
        ["Outgoing links", totals.outgoing],
        ["Links in web parts", totals.webpart],
        ["Links in navigation", totals.navigation],
        ["Links in documents", totals.documentLinks],
        ["Links in attachments", totals.attachmentLinks],
        ["Links in config files", totals.configLinks],
        ["Links in the mega menu", totals.megaMenuLinks],
        ["Destinations", totals.destinations],
        ["This site links", types.thisSite],
        ["Other site links", types.otherSite],
        ["Legacy links", types.legacy],
        ["Document links", types.document],
        ["External links", types.external],
        ["Anchor links", types.anchor],
        ["Contact links", types.contact],
        ["Script links", types.script],
        ["Unknown links", types.unknown],
        ["Insecure links", types.insecure],
        ["Links with no text", types.emptyText],
        ["Open in new tab", types.newTab],
        ["Matched to an item", types.matched],
        ["Unmapped", types.unmapped],
        ["Broken", totals.broken],
        ["Untested", totals.untested],
    ];
}
function exportAudit(name, references, destinations, keep) {
    const rows = auditRows(references).filter(keep !== null && keep !== void 0 ? keep : (() => true));
    downloadCsvWithSummary(`${name}-${stamp()}`, summaryBlock(references, destinations), rows);
}
export function exportFullAudit(references, destinations) {
    exportAudit("link-audit", references, destinations);
}
export function exportExternalAudit(references, destinations) {
    exportAudit("external-link-audit", references, destinations, (row) => row.isExternal === "Yes");
}
export function exportBrokenAudit(references, destinations) {
    exportAudit("broken-link-audit", references, destinations, (row) => row.isBroken === LinkAuditContent.status.yes);
}
export function exportUntestedAudit(references, destinations) {
    exportAudit("untested-link-audit", references, destinations, (row) => row.isBroken === LinkAuditContent.status.unsure);
}
export function exportReferenceList(references) {
    downloadCsv(`link-audit-items-${stamp()}`, referenceRows(references));
}
/** The links on one item, for the export button inside its dialog. */
export function exportReferenceLinks(reference) {
    downloadCsv(`links-${slug(reference.title || "item")}`, auditRows([reference]));
}
/** Every place one aggregated link is used, for the export button in its dialog. */
export function exportLinkUsages(link, origin) {
    const rows = link.usages.map((usage) => ({
        linkUrl: link.url,
        linkType: link.linkType,
        isBroken: statusLabel(link.broken),
        status: link.status || "",
        resolvesTo: link.targetTitle,
        usedInList: usage.reference.listTitle,
        usedInId: usage.reference.itemId,
        usedInTitle: usage.reference.title,
        usedInUrl: usage.reference.url,
        foundIn: usage.reference.source,
        foundInLabel: usage.reference.sourceLabel,
        linkText: usage.link.text,
        writtenAs: usage.link.url,
    }));
    downloadCsv(`link-usages-${slug(normaliseUrl(link.url, origin))}`, rows);
}
function slug(value) {
    return value.replace(/[^a-z0-9]+/gi, "-").substring(0, 60);
}
function stamp() {
    return new Date().toISOString().substring(0, 10);
}
function yesNo(value) {
    return value ? "Yes" : "No";
}
//# sourceMappingURL=LinkAudit.csv.js.map