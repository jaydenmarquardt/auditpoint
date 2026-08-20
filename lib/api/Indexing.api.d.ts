import { SiteList } from "./Lists.types";
import { ItemIndexCheck, SampleItem, SiteIndexSettings } from "./Indexing.types";
export declare function Indexing(webUrl?: string): {
    site(): Promise<SiteIndexSettings>;
    indexedCount(list: SiteList): Promise<number>;
    sampleItems(list: SiteList, count: number): Promise<SampleItem[]>;
    checkItem(list: SiteList, item: SampleItem): Promise<ItemIndexCheck>;
    managedProperties(): Promise<string[]>;
};
//# sourceMappingURL=Indexing.api.d.ts.map