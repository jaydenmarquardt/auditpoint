import { TableColumn } from "../../components/Components.types";
import { WebPartInstance } from "../../api/WebParts.types";
import { WebPartPageSummary, WebPartTypeSummary } from "./WebPartAudit.types";
export declare function sourceLabel(isOutOfBox: boolean, isThirdParty: boolean): string;
export declare function densityLabel(count: number): string;
export declare const typeColumns: TableColumn<WebPartTypeSummary>[];
export declare function instanceColumns(onOpenPage: (instance: WebPartInstance) => void): TableColumn<WebPartInstance>[];
export declare const pageColumns: TableColumn<WebPartPageSummary>[];
//# sourceMappingURL=WebPartAudit.columns.d.ts.map