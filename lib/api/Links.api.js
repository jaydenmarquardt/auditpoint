import { __awaiter } from "tslib";
import { getWebUrl } from "./Sp.api";
import { throttled } from "./Throttle.api";
/** Property names that hold a link even when the value is not a recognisable url. */
const LINK_KEYS = /(url|href|link|target|src|path)$/i;
const URL_VALUE = /^(https?:\/\/|\/|mailto:|tel:|#)/i;
const HTML_VALUE = /<a\s[^>]*href=/i;
// A web part's saved properties can nest deeply; stopping keeps a broken page cheap.
const MAX_PROPERTY_DEPTH = 6;
export function LinkScanner(webUrl) {
    const origin = originOf(webUrl);
    return {
        /** Every anchor in a stored HTML string, kept exactly as it was written. */
        fromHtml(html, context) {
            if (!html || html.trim().length === 0)
                return [];
            const document = new DOMParser().parseFromString(html, "text/html");
            return Array.from(document.querySelectorAll("a")).map((anchor) => {
                var _a, _b, _c;
                return (Object.assign(Object.assign({}, placement(((_a = anchor.getAttribute("href")) !== null && _a !== void 0 ? _a : "").trim(), ((_b = anchor.textContent) !== null && _b !== void 0 ? _b : "").replace(/\s+/g, " ").trim(), context, origin)), { newTab: ((_c = anchor.getAttribute("target")) !== null && _c !== void 0 ? _c : "").toLowerCase() === "_blank" }));
            });
        },
        fromUrl(url, text, context, newTab = false) {
            return placement(url, text, context, origin, newTab);
        },
        /**
         * Web part links live in saved JSON rather than markup, so the property bag is
         * walked for anything url shaped and any HTML value is parsed as well.
         */
        fromProperties(properties, context) {
            const found = new Map();
            const visit = (value, key, depth) => {
                if (depth > MAX_PROPERTY_DEPTH || value === null || value === undefined)
                    return;
                if (typeof value === "string") {
                    const text = value.trim();
                    if (text.length === 0)
                        return;
                    if (HTML_VALUE.test(text)) {
                        new DOMParser()
                            .parseFromString(text, "text/html")
                            .querySelectorAll("a")
                            .forEach((anchor) => {
                            var _a, _b, _c;
                            const href = ((_a = anchor.getAttribute("href")) !== null && _a !== void 0 ? _a : "").trim();
                            const label = ((_b = anchor.textContent) !== null && _b !== void 0 ? _b : "").replace(/\s+/g, " ").trim();
                            if (href) {
                                found.set(`${href}|${label}`, Object.assign(Object.assign({}, placement(href, label, context, origin)), { newTab: ((_c = anchor.getAttribute("target")) !== null && _c !== void 0 ? _c : "").toLowerCase() === "_blank" }));
                            }
                        });
                        return;
                    }
                    if (URL_VALUE.test(text) || LINK_KEYS.test(key)) {
                        if (URL_VALUE.test(text))
                            found.set(`${text}|`, placement(text, "", context, origin));
                    }
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach((entry) => visit(entry, key, depth + 1));
                    return;
                }
                if (typeof value === "object") {
                    Object.keys(value).forEach((child) => visit(value[child], child, depth + 1));
                }
            };
            visit(properties, "", 0);
            return [...found.values()];
        },
    };
}
export function LinkChecker() {
    return {
        /**
         * Same origin only, so the status is readable. A throttle is thrown rather than
         * returned, which hands the backoff to the one place that owns it.
         */
        check(url) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const status = yield throttled(() => __awaiter(this, void 0, void 0, function* () {
                        let response = yield fetch(url, { method: "HEAD", credentials: "same-origin", redirect: "follow" });
                        // Some SharePoint endpoints refuse HEAD but answer a GET quite happily.
                        if (response.status === 405 || response.status === 501) {
                            response = yield fetch(url, { method: "GET", credentials: "same-origin", redirect: "follow" });
                        }
                        if (response.status === 429 || response.status === 503) {
                            throw Object.assign(new Error(`Throttled (${response.status})`), {
                                status: response.status,
                                headers: response.headers,
                            });
                        }
                        return response.status;
                    }), { label: "Links.check" });
                    return { url, status };
                }
                catch (_a) {
                    // A network level failure says nothing about whether the page exists.
                    return { url, status: 0 };
                }
            });
        },
    };
}
export function placement(url, text, context, origin, newTab = false) {
    const value = `${url !== null && url !== void 0 ? url : ""}`.trim();
    const isAnchor = value.startsWith("#");
    const isContact = /^(mailto:|tel:)/i.test(value);
    const isJS = /^javascript:/i.test(value);
    const isLink = !isAnchor && !isContact && !isJS && value.length > 0;
    return {
        url: value,
        text: `${text !== null && text !== void 0 ? text : ""}`.trim(),
        source: context.source,
        sourceLabel: context.sourceLabel,
        isInternal: isLink && isSameOrigin(value, origin),
        isExternal: isLink && !isSameOrigin(value, origin) && /^https?:\/\//i.test(value),
        isInsecure: /^http:\/\//i.test(value),
        isAnchor,
        isContact,
        isJS,
        newTab,
    };
}
export function originOf(webUrl) {
    try {
        return new URL(webUrl && webUrl.length > 0 ? webUrl : getWebUrl()).origin;
    }
    catch (_a) {
        return window.location.origin;
    }
}
function isSameOrigin(url, origin) {
    if (url.startsWith("/"))
        return true;
    if (!/^https?:\/\//i.test(url))
        return false;
    try {
        return new URL(url).origin.toLowerCase() === origin.toLowerCase();
    }
    catch (_a) {
        return false;
    }
}
//# sourceMappingURL=Links.api.js.map