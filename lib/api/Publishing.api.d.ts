import { SiteList } from "./Lists.types";
import { PopularityRow, PublishingItem } from "./Publishing.types";
export declare function Publishing(webUrl?: string): {
    fieldNames(list: SiteList): Promise<string[]>;
    items(list: SiteList, dateColumns: string[], top: number): Promise<PublishingItem[]>;
    versions(list: SiteList, itemId: number, depth: number): Promise<{
        count: number;
        editors: string[];
    }>;
    popularity(rowLimit: number): Promise<PopularityRow[]>;
};
//# sourceMappingURL=Publishing.api.d.ts.map