import { downloadCsv } from "../../utils/Export.util";
export function entryRow(entry) {
    var _a, _b, _c, _d, _e, _f;
    return {
        site: entry.siteUrl,
        source: entry.source,
        list: entry.listTitle,
        column: entry.column,
        title: entry.title,
        url: entry.url,
        modified: entry.modified,
        words: entry.words,
        characters: entry.characters,
        paragraphs: entry.paragraphs,
        headings: entry.headings,
        h1: (_b = (_a = entry.headingsByLevel) === null || _a === void 0 ? void 0 : _a.h1) !== null && _b !== void 0 ? _b : 0,
        h2: (_d = (_c = entry.headingsByLevel) === null || _c === void 0 ? void 0 : _c.h2) !== null && _d !== void 0 ? _d : 0,
        h3: (_f = (_e = entry.headingsByLevel) === null || _e === void 0 ? void 0 : _e.h3) !== null && _f !== void 0 ? _f : 0,
        images: entry.images,
        links: entry.links,
        externalLinks: entry.externalLinks,
        emptyLinks: entry.emptyLinks,
        tables: entry.tables,
        embeds: entry.embeds,
        readingMinutes: entry.readingMinutes,
    };
}
export function exportContentAudit(data) {
    var _a;
    downloadCsv("content-audit", ((_a = data === null || data === void 0 ? void 0 : data.entries) !== null && _a !== void 0 ? _a : []).map(entryRow));
}
//# sourceMappingURL=ContentAudit.csv.js.map