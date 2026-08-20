import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";
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

let instance: SPFI | undefined;
let webPartContext: WebPartContext | undefined;
const remoteInstances = new Map<string, SPFI>();

/** Called once from the web part onInit; everything else reaches PnP through getSp(). */
export function setupSp(context: WebPartContext): SPFI {
  webPartContext = context;
  instance = spfi().using(SPFx(context));
  remoteInstances.clear();
  return instance;
}

export function getSp(webUrl?: string): SPFI {
  if (!instance) throw new Error("PnP is not initialised. Call setupSp(context) from the web part onInit.");
  if (!webUrl || sameWeb(webUrl)) return instance;

  const key = webUrl.replace(/\/$/, "").toLowerCase();
  const cached = remoteInstances.get(key);
  if (cached) return cached;

  const remote = spfi(webUrl).using(SPFx(getContext()));
  remoteInstances.set(key, remote);
  return remote;
}

function sameWeb(webUrl: string): boolean {
  const current = getContext().pageContext.web.absoluteUrl.replace(/\/$/, "").toLowerCase();
  return webUrl.replace(/\/$/, "").toLowerCase() === current;
}

export function getContext(): WebPartContext {
  if (!webPartContext) throw new Error("Web part context is not initialised. Call setupSp(context) first.");
  return webPartContext;
}

export function getWebUrl(): string {
  return getContext().pageContext.web.absoluteUrl;
}

export function getSiteRelativeUrl(): string {
  return getContext().pageContext.web.serverRelativeUrl;
}

export function getWebTitle(): string {
  return getContext().pageContext.web.title;
}
