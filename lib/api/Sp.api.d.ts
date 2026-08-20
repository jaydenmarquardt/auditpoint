import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/security";
import "@pnp/sp/batching";
import "@pnp/sp/content-types/list";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/search";
import "@pnp/sp/profiles";
import "@pnp/sp/fields/list";
import "@pnp/sp/items/list";
import "@pnp/sp/comments/item";
import "@pnp/sp/lists/web";
/** Called once from the web part onInit; everything else reaches PnP through getSp(). */
export declare function setupSp(context: WebPartContext): SPFI;
export declare function getSp(webUrl?: string): SPFI;
export declare function getContext(): WebPartContext;
export declare function getWebUrl(): string;
export declare function getSiteRelativeUrl(): string;
export declare function getWebTitle(): string;
//# sourceMappingURL=Sp.api.d.ts.map