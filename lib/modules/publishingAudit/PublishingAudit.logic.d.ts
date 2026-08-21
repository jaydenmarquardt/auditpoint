import { PublishingItem } from "../../api/Publishing.types";
import { PublishingAuditConfig, PublishingAuditData, PublishingAuditView, PublishingPerson } from "./PublishingAudit.types";
export declare function statusLabel(status: number | undefined): string;
export declare function daysSinceEdit(item: PublishingItem): number;
export declare function isStale(item: PublishingItem, staleDays: number): boolean;
/**
 * Nothing published: either moderation is holding it, or its only version is a minor
 * one, which is what a draft looks like on a library with major versions switched on.
 */
export declare function isUnpublished(item: PublishingItem): boolean;
export declare function reviewDate(item: PublishingItem): string | undefined;
export declare function expiryDate(item: PublishingItem): string | undefined;
export declare function buildView(data: Partial<PublishingAuditData> | undefined, config: PublishingAuditConfig): PublishingAuditView;
/**
 * Everyone who created or last edited something, with their own slice of the scan.
 * Authors and editors share one list: people ask "what has Jo touched", not "what did
 * Jo touch as an editor".
 */
export declare function peopleFrom(items: PublishingItem[], staleDays: number): PublishingPerson[];
//# sourceMappingURL=PublishingAudit.logic.d.ts.map