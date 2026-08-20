import * as React from "react";
import { TableColumn } from "../../../components/Components.types";
import { SiteList } from "../../../api/Lists.types";
export interface AllListsTabProps {
    rows: SiteList[];
    columns: TableColumn<SiteList>[];
    onSelect: (list: SiteList) => void;
}
export declare const AllListsTab: React.FC<AllListsTabProps>;
//# sourceMappingURL=AllLists.tab.d.ts.map