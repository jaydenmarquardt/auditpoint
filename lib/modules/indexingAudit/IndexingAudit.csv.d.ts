import { ItemIndexCheck, ListIndexCoverage } from "../../api/Indexing.types";
import { IndexingAuditData } from "./IndexingAudit.types";
export declare function listRow(list: ListIndexCoverage): Record<string, unknown>;
export declare function itemRow(item: ItemIndexCheck): Record<string, unknown>;
export declare function exportIndexingAudit(data: Partial<IndexingAuditData> | undefined): void;
export declare function exportIndexChecks(data: Partial<IndexingAuditData> | undefined): void;
//# sourceMappingURL=IndexingAudit.csv.d.ts.map