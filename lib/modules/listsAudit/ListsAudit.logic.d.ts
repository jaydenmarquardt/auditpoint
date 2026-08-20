import { SiteList } from "../../api/Lists.types";
import { ListsAuditData, ListsAuditTotals, ListsAuditView } from "./ListsAudit.types";
export declare function buildView(data: Partial<ListsAuditData> | undefined): ListsAuditView;
export declare function totalsOf(lists: SiteList[]): ListsAuditTotals;
export declare function isStale(list: SiteList, staleDays: number): boolean;
export declare function daysSince(iso: string): number;
export declare function extensionLabel(extension: string): string;
//# sourceMappingURL=ListsAudit.logic.d.ts.map