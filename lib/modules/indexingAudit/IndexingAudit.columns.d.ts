import { TableColumn } from "../../components/Components.types";
import { ItemIndexCheck, ListIndexCoverage } from "../../api/Indexing.types";
export declare function listColumns(target: number): TableColumn<ListIndexCoverage>[];
export declare function coverageBand(list: ListIndexCoverage, target: number): string;
export declare const itemColumns: TableColumn<ItemIndexCheck>[];
export declare function stateLabel(item: ItemIndexCheck): string;
//# sourceMappingURL=IndexingAudit.columns.d.ts.map