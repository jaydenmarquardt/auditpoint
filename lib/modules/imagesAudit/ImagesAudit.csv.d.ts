import { ImageUsage } from "../../api/Images.types";
import { ImageFileView, ImagesAuditView } from "./ImagesAudit.types";
export declare function fileRow(file: ImageFileView): Record<string, unknown>;
export declare function usageRow(usage: ImageUsage): Record<string, unknown>;
export declare function exportFiles(view: ImagesAuditView): void;
export declare function exportUsages(usages: ImageUsage[]): void;
//# sourceMappingURL=ImagesAudit.csv.d.ts.map