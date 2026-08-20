import { ListApi } from "./List.types";
import { SitePage } from "./SitePages.types";
export declare function SitePages(webUrl?: string): ListApi<SitePage> & {
    getHtml(serverRelativeUrl: string): Promise<string>;
};
//# sourceMappingURL=SitePages.api.d.ts.map