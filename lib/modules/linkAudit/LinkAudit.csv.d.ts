import { AggregatedLink, Reference } from "./LinkAudit.types";
/** One row per link found, rather than one per item: the unresolved ones are the point. */
export declare function auditRows(references: Reference[]): Record<string, unknown>[];
export declare function referenceRows(references: Reference[]): Record<string, unknown>[];
export declare function exportFullAudit(references: Reference[], destinations: number): void;
export declare function exportExternalAudit(references: Reference[], destinations: number): void;
export declare function exportBrokenAudit(references: Reference[], destinations: number): void;
export declare function exportUntestedAudit(references: Reference[], destinations: number): void;
export declare function exportReferenceList(references: Reference[]): void;
/** The links on one item, for the export button inside its dialog. */
export declare function exportReferenceLinks(reference: Reference): void;
/** Every place one aggregated link is used, for the export button in its dialog. */
export declare function exportLinkUsages(link: AggregatedLink, origin: string): void;
//# sourceMappingURL=LinkAudit.csv.d.ts.map