import { BrokenState, LinkSource, LinkType } from "../../api/Links.types";
import { AggregatedLink, LinkAuditConfig, LinkAuditData, LinkAuditView, LinkTypeTotals, LinkUsage, OutgoingLink, Reference, ReferenceSummary, ReferenceTotals } from "./LinkAudit.types";
export declare const LINK_TYPES: LinkType[];
export interface ClassifyOptions {
    origin: string;
    /** Server relative path of the site being audited, which separates it from its neighbours. */
    sitePath: string;
    legacyHosts: string[];
}
export declare function legacyHostsOf(config: LinkAuditConfig): string[];
/**
 * A fragment or query never changes which page a link lands on, so both are dropped
 * before matching against the index or requesting the url.
 */
export declare function stripUrlSuffix(url: string): string;
export declare function isLegacyUrl(url: string, legacyHosts: string[]): boolean;
/** Same tenancy and inside the audited site, rather than a neighbouring one. */
export declare function isThisSiteUrl(url: string, origin: string, sitePath: string): boolean;
export declare function isIntranetUrl(url: string, origin: string): boolean;
/**
 * Works out what a link points at, first match wins. Everything downstream, including
 * whether it is worth testing for a 404, hangs off this.
 */
export declare function classifyLink(link: OutgoingLink, options: ClassifyOptions): LinkType;
/**
 * Sets the type, flags and a starting broken state on every link. Links that can never
 * be broken settle here; the rest stay unsure until the index resolves them or the
 * broken link stage tests them.
 */
export declare function classifyReferences(references: Reference[], options: ClassifyOptions): void;
/**
 * Resolves incoming links by building a url lookup and walking each outgoing link
 * once. Comparing every item against every other was O(items squared). Safe to
 * re-run, which the document and broken stages depend on.
 */
export declare function indexReferences(references: Reference[]): void;
export declare function summaryOf(reference: Reference, link?: OutgoingLink): ReferenceSummary;
/** Every link the broken link stage could actually learn something from. */
export declare function brokenCheckCandidates(references: Reference[]): string[];
/** Writes one request's result back onto every link that used that url. */
export declare function applyBrokenResults(references: Reference[], results: Map<string, number>): number;
/**
 * Absolute and server relative spellings of the same page have to land on the same
 * key, so the origin is stripped rather than kept.
 */
export declare function normaliseUrl(url: string, origin: string): string;
/** Collapses every spelling of the same destination into one row. */
export declare function aggregateLinks(references: Reference[], origin: string): AggregatedLink[];
/** Counts every link by kind, including the ones with no text on them. */
export declare function summariseLinkTypes(references: Reference[]): LinkTypeTotals;
export declare function summariseReferences(references: Reference[], destinations: number): ReferenceTotals;
export declare function statusLabel(broken: BrokenState): string;
export declare function sourceLabel(source: LinkSource): string;
/** Everything worth flagging on one scanned item, used by the table and the dialog. */
export declare function flagsFor(reference: Reference): string[];
export declare function brokenUsages(links: AggregatedLink[]): LinkUsage[];
export declare function externalUsages(links: AggregatedLink[]): LinkUsage[];
export declare function buildView(data: Partial<LinkAuditData> | undefined, origin: string): LinkAuditView;
//# sourceMappingURL=LinkAudit.logic.d.ts.map