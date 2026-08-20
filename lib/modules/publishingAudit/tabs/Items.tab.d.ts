import * as React from "react";
import { TableColumn } from "../../../components/Components.types";
import { PublishingItem } from "../../../api/Publishing.types";
export declare const ItemsTab: React.FC<{
    items: PublishingItem[];
    columns?: TableColumn<PublishingItem>[];
    emptyTitle?: string;
    emptyDescription?: string;
    onSelect: (item: PublishingItem) => void;
}>;
//# sourceMappingURL=Items.tab.d.ts.map