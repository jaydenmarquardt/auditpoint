const WORDS_PER_MINUTE = 220;
/** Everything the audit measures comes from one parse of the stored HTML. */
export function analyseHtml(html, siteHost) {
    var _a;
    const document = new DOMParser().parseFromString(html !== null && html !== void 0 ? html : "", "text/html");
    const text = ((_a = document.body.textContent) !== null && _a !== void 0 ? _a : "").replace(/\s+/g, " ").trim();
    const words = text.length === 0 ? 0 : text.split(" ").length;
    const headingsByLevel = {};
    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
        headingsByLevel[tag] = document.querySelectorAll(tag).length;
    });
    const images = Array.from(document.querySelectorAll("img"));
    const links = Array.from(document.querySelectorAll("a"));
    const hrefs = links.map((link) => { var _a; return ((_a = link.getAttribute("href")) !== null && _a !== void 0 ? _a : "").trim(); });
    return {
        words,
        characters: text.length,
        paragraphs: document.querySelectorAll("p").length,
        headings: Object.values(headingsByLevel).reduce((sum, count) => sum + count, 0),
        headingsByLevel,
        images: images.length,
        imagesWithoutAlt: images.filter((image) => { var _a; return !((_a = image.getAttribute("alt")) !== null && _a !== void 0 ? _a : "").trim(); }).length,
        links: links.length,
        externalLinks: hrefs.filter((href) => isExternal(href, siteHost)).length,
        internalLinks: hrefs.filter((href) => isInternal(href, siteHost)).length,
        mailtoLinks: hrefs.filter((href) => /^mailto:/i.test(href)).length,
        emptyLinks: hrefs.filter((href) => href === "" || href === "#" || /^javascript:/i.test(href)).length,
        tables: document.querySelectorAll("table").length,
        listBlocks: document.querySelectorAll("ul, ol").length,
        embeds: document.querySelectorAll("iframe, video, embed").length,
        readingMinutes: Math.max(words === 0 ? 0 : 1, Math.round(words / WORDS_PER_MINUTE)),
    };
}
function isExternal(href, siteHost) {
    if (!/^https?:\/\//i.test(href))
        return false;
    try {
        return new URL(href).host.toLowerCase() !== siteHost.toLowerCase();
    }
    catch (_a) {
        return false;
    }
}
function isInternal(href, siteHost) {
    if (href.startsWith("/"))
        return true;
    if (!/^https?:\/\//i.test(href))
        return false;
    try {
        return new URL(href).host.toLowerCase() === siteHost.toLowerCase();
    }
    catch (_a) {
        return false;
    }
}
//# sourceMappingURL=ContentAudit.analysis.js.map