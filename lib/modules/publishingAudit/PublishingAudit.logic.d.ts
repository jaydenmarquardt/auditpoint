import { PublishingItem } from "../../api/Publishing.types";
import { PublishingAuditConfig, PublishingAuditData, PublishingAuditView } from "./PublishingAudit.types";
export declare function statusLabel(status: number | undefined): string;
export declare function daysSinceEdit(item: PublishingItem): number;
export declare function isStale(item: PublishingItem, staleDays: number): boolean;
export declare function reviewDate(item: PublishingItem): string | undefined;
export declare function expiryDate(item: PublishingItem): string | undefined;
export declare function buildView(data: Partial<PublishingAuditData> | undefined, config: PublishingAuditConfig): PublishingAuditView;
//# sourceMappingURL=PublishingAudit.logic.d.ts.map