import { ListScan, SiteList } from "./Lists.types";
export declare function SiteLists(webUrl?: string): {
    getAll(includeHidden: boolean): Promise<SiteList[]>;
    withStorage(list: SiteList): Promise<SiteList>;
    contentTypes(list: SiteList): Promise<string[]>;
    contentTypesBulk(lists: SiteList[]): Promise<Map<string, string[]>>;
    scanItems(list: SiteList, maxItems: number): Promise<ListScan>;
    settingsUrl(list: SiteList): string;
    advancedSettingsUrl(list: SiteList): string;
    permissionsUrl(list: SiteList): string;
};
//# sourceMappingURL=Lists.api.d.ts.map