import { SiteList } from "./Lists.types";
import { CanvasPage } from "./WebParts.types";
import { ContentRecord, RichColumn } from "./Content.types";
export declare function ContentSource(webUrl?: string): {
    richTextColumns(list: SiteList): Promise<RichColumn[]>;
    fieldNames(list: SiteList): Promise<string[]>;
    items(list: SiteList, columns: string[], top: number): Promise<ContentRecord[]>;
    pageHtml(page: CanvasPage): string;
};
//# sourceMappingURL=Content.api.d.ts.map