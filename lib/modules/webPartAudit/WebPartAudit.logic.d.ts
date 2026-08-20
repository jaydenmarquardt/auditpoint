import { CatalogueEntry, WebPartInstance } from "../../api/WebParts.types";
import { WebPartAuditData, WebPartAuditView, WebPartTypeSummary } from "./WebPartAudit.types";
export declare function buildView(data: Partial<WebPartAuditData> | undefined): WebPartAuditView;
export declare function summariseTypes(instances: WebPartInstance[], catalogue: CatalogueEntry[]): WebPartTypeSummary[];
export interface PropertyUsage {
    key: string;
    present: number;
    percent: number;
    topValues: {
        value: string;
        count: number;
    }[];
}
export declare function propertyUsage(instances: WebPartInstance[]): PropertyUsage[];
export declare function instancesOfType(instances: WebPartInstance[], key: string): WebPartInstance[];
/** Fluent charts key on the label, so repeated names have to be made unique. */
export declare function dedupeLabels(points: {
    label: string;
    value: number;
}[]): {
    label: string;
    value: number;
}[];
//# sourceMappingURL=WebPartAudit.logic.d.ts.map