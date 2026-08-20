import { getWebUrl } from "@/api/Sp.api";
import { throttled } from "@/api/Throttle.api";
import { LinkContext, LinkCheck, LinkPlacement } from "@/api/Links.types";

/** Property names that hold a link even when the value is not a recognisable url. */
const LINK_KEYS = /(url|href|link|target|src|path)$/i;
const URL_VALUE = /^(https?:\/\/|\/|mailto:|tel:|#)/i;
const HTML_VALUE = /<a\s[^>]*href=/i;
// A web part's saved properties can nest deeply; stopping keeps a broken page cheap.
const MAX_PROPERTY_DEPTH = 6;

export function LinkScanner(webUrl?: string): {
  fromHtml(html: string, context: LinkContext): LinkPlacement[];
  fromUrl(url: string, text: string, context: LinkContext): LinkPlacement;
  fromProperties(properties: Record<string, unknown>, context: LinkContext): LinkPlacement[];
} {
  const origin = originOf(webUrl);

  return {
    /** Every anchor in a stored HTML string, kept exactly as it was written. */
    fromHtml(html: string, context: LinkContext): LinkPlacement[] {
      if (!html || html.trim().length === 0) return [];

      const document = new DOMParser().parseFromString(html, "text/html");

      return Array.from(document.querySelectorAll("a")).map((anchor) =>
        placement(
          (anchor.getAttribute("href") ?? "").trim(),
          (anchor.textContent ?? "").replace(/\s+/g, " ").trim(),
          context,
          origin
        )
      );
    },

    fromUrl(url: string, text: string, context: LinkContext): LinkPlacement {
      return placement(url, text, context, origin);
    },

    /**
     * Web part links live in saved JSON rather than markup, so the property bag is
     * walked for anything url shaped and any HTML value is parsed as well.
     */
    fromProperties(properties: Record<string, unknown>, context: LinkContext): LinkPlacement[] {
      const found = new Map<string, LinkPlacement>();

      const visit = (value: unknown, key: string, depth: number): void => {
        if (depth > MAX_PROPERTY_DEPTH || value === null || value === undefined) return;

        if (typeof value === "string") {
          const text = value.trim();
          if (text.length === 0) return;

          if (HTML_VALUE.test(text)) {
            new DOMParser()
              .parseFromString(text, "text/html")
              .querySelectorAll("a")
              .forEach((anchor) => {
                const href = (anchor.getAttribute("href") ?? "").trim();
                const label = (anchor.textContent ?? "").replace(/\s+/g, " ").trim();
                if (href) found.set(`${href}|${label}`, placement(href, label, context, origin));
              });
            return;
          }

          if (URL_VALUE.test(text) || LINK_KEYS.test(key)) {
            if (URL_VALUE.test(text)) found.set(`${text}|`, placement(text, "", context, origin));
          }
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((entry) => visit(entry, key, depth + 1));
          return;
        }

        if (typeof value === "object") {
          Object.keys(value as Record<string, unknown>).forEach((child) =>
            visit((value as Record<string, unknown>)[child], child, depth + 1)
          );
        }
      };

      visit(properties, "", 0);
      return [...found.values()];
    },
  };
}

export function LinkChecker(): { check(url: string): Promise<LinkCheck> } {
  return {
    /**
     * Same origin only, so the status is readable. A throttle is thrown rather than
     * returned, which hands the backoff to the one place that owns it.
     */
    async check(url: string): Promise<LinkCheck> {
      try {
        const status = await throttled(async () => {
          let response = await fetch(url, { method: "HEAD", credentials: "same-origin", redirect: "follow" });

          // Some SharePoint endpoints refuse HEAD but answer a GET quite happily.
          if (response.status === 405 || response.status === 501) {
            response = await fetch(url, { method: "GET", credentials: "same-origin", redirect: "follow" });
          }

          if (response.status === 429 || response.status === 503) {
            throw Object.assign(new Error(`Throttled (${response.status})`), {
              status: response.status,
              headers: response.headers,
            });
          }

          return response.status;
        }, { label: "Links.check" });

        return { url, status };
      } catch {
        // A network level failure says nothing about whether the page exists.
        return { url, status: 0 };
      }
    },
  };
}

export function placement(url: string, text: string, context: LinkContext, origin: string): LinkPlacement {
  const value = `${url ?? ""}`.trim();
  const isAnchor = value.startsWith("#");
  const isContact = /^(mailto:|tel:)/i.test(value);
  const isJS = /^javascript:/i.test(value);
  const isLink = !isAnchor && !isContact && !isJS && value.length > 0;

  return {
    url: value,
    text: `${text ?? ""}`.trim(),
    source: context.source,
    sourceLabel: context.sourceLabel,
    isInternal: isLink && isSameOrigin(value, origin),
    isExternal: isLink && !isSameOrigin(value, origin) && /^https?:\/\//i.test(value),
    isInsecure: /^http:\/\//i.test(value),
    isAnchor,
    isContact,
    isJS,
  };
}

export function originOf(webUrl?: string): string {
  try {
    return new URL(webUrl && webUrl.length > 0 ? webUrl : getWebUrl()).origin;
  } catch {
    return window.location.origin;
  }
}

function isSameOrigin(url: string, origin: string): boolean {
  if (url.startsWith("/")) return true;
  if (!/^https?:\/\//i.test(url)) return false;

  try {
    return new URL(url).origin.toLowerCase() === origin.toLowerCase();
  } catch {
    return false;
  }
}
