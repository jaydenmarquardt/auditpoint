export function serverRelative(absoluteOrRelative, webUrl) {
    if (!absoluteOrRelative)
        return "";
    if (absoluteOrRelative.startsWith("/"))
        return absoluteOrRelative;
    try {
        return new URL(absoluteOrRelative, webUrl).pathname;
    }
    catch (_a) {
        return absoluteOrRelative;
    }
}
export function joinPath(...segments) {
    return segments
        .filter(Boolean)
        .map((segment, index) => (index === 0 ? segment.replace(/\/+$/, "") : segment.replace(/^\/+|\/+$/g, "")))
        .join("/");
}
const ROUTE_PARAM = "page";
/** The route lives in the query string so a module can be linked to directly. */
export function readRoute(fallback) {
    var _a;
    const raw = (_a = new URL(window.location.href).searchParams.get(ROUTE_PARAM)) === null || _a === void 0 ? void 0 : _a.trim();
    return raw && raw.length > 0 ? raw : fallback;
}
export function writeRoute(route) {
    const url = new URL(window.location.href);
    if (url.searchParams.get(ROUTE_PARAM) === route)
        return;
    url.searchParams.set(ROUTE_PARAM, route);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}
/** Server-relative paths are origin-relative, so only the origin has to be prefixed. */
export function absoluteFromServerRelative(serverRelativeUrl, webAbsoluteUrl) {
    const origin = new URL(webAbsoluteUrl).origin;
    return `${origin}${serverRelativeUrl}`;
}
/** SharePoint switches a page into edit mode via the Mode query string. */
export function editModeUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("Mode", "Edit");
    return url.toString();
}
//# sourceMappingURL=Url.util.js.map