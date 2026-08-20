import { WebPartInstance } from "../../api/WebParts.types";
import { WebPartAuditData } from "./WebPartAudit.types";
export declare function instanceRow(instance: WebPartInstance): Record<string, unknown>;
export declare function exportWebPartAudit(data: Partial<WebPartAuditData> | undefined): void;
export declare function exportTypeInstances(name: string, instances: WebPartInstance[]): void;
//# sourceMappingURL=WebPartAudit.csv.d.ts.map