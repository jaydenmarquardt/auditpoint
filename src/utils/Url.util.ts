export function serverRelative(absoluteOrRelative: string, webUrl: string): string {
  if (!absoluteOrRelative) return "";
  if (absoluteOrRelative.startsWith("/")) return absoluteOrRelative;
  try {
    return new URL(absoluteOrRelative, webUrl).pathname;
  } catch {
    return absoluteOrRelative;
  }
}

export function joinPath(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .map((segment, index) => (index === 0 ? segment.replace(/\/+$/, "") : segment.replace(/^\/+|\/+$/g, "")))
    .join("/");
}

const ROUTE_PARAM = "page";

/** The route lives in the query string so a module can be linked to directly. */
export function readRoute(fallback: string): string {
  const raw = new URL(window.location.href).searchParams.get(ROUTE_PARAM)?.trim();
  return raw && raw.length > 0 ? raw : fallback;
}

export function writeRoute(route: string): void {
  const url = new URL(window.location.href);
  if (url.searchParams.get(ROUTE_PARAM) === route) return;

  url.searchParams.set(ROUTE_PARAM, route);
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

/** Server-relative paths are origin-relative, so only the origin has to be prefixed. */
export function absoluteFromServerRelative(serverRelativeUrl: string, webAbsoluteUrl: string): string {
  const origin = new URL(webAbsoluteUrl).origin;
  return `${origin}${serverRelativeUrl}`;
}

/** SharePoint switches a page into edit mode via the Mode query string. */
export function editModeUrl(): string {
  const url = new URL(window.location.href);
  url.searchParams.set("Mode", "Edit");
  return url.toString();
}
