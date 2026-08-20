import * as React from "react";
import { PublishingItem } from "../../api/Publishing.types";
export interface ItemDialogProps {
    item?: PublishingItem;
    versionDepth: number;
    onLoaded: (item: PublishingItem, count: number, editors: string[]) => void;
    onDismiss: () => void;
}
export declare const ItemDialog: React.FC<ItemDialogProps>;
//# sourceMappingURL=Item.dialog.d.ts.map