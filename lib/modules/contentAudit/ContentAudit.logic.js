import { ContentAuditContent } from "./ContentAudit.content";
export function issuesFor(entry, thinWordCount) {
    const issues = [];
    if (entry.words > 0 && entry.words < thinWordCount)
        issues.push(ContentAuditContent.issues.thin);
    if (entry.words > 50 && entry.headings === 0)
        issues.push(ContentAuditContent.issues.noHeadings);
    if (entry.emptyLinks > 0)
        issues.push(ContentAuditContent.issues.emptyLinks);
    return issues;
}
export function buildView(data, config) {
    var _a;
    const entries = (_a = data === null || data === void 0 ? void 0 : data.entries) !== null && _a !== void 0 ? _a : [];
    const totals = {
        entries: entries.length,
        pages: entries.filter((entry) => entry.source === "page").length,
        items: entries.filter((entry) => entry.source === "item").length,
        words: sum(entries, (entry) => entry.words),
        characters: sum(entries, (entry) => entry.characters),
        averageWords: entries.length === 0 ? 0 : Math.round(sum(entries, (entry) => entry.words) / entries.length),
        averageReadingMinutes: entries.length === 0
            ? 0
            : Math.round((sum(entries, (entry) => entry.readingMinutes) / entries.length) * 10) / 10,
        headings: sum(entries, (entry) => entry.headings),
        images: sum(entries, (entry) => entry.images),
        links: sum(entries, (entry) => entry.links),
        externalLinks: sum(entries, (entry) => entry.externalLinks),
        emptyLinks: sum(entries, (entry) => entry.emptyLinks),
        tables: sum(entries, (entry) => entry.tables),
        embeds: sum(entries, (entry) => entry.embeds),
        thin: entries.filter((entry) => entry.words > 0 && entry.words < config.thinWordCount).length,
        noHeadings: entries.filter((entry) => entry.words > 50 && entry.headings === 0).length,
        readingMinutes: sum(entries, (entry) => entry.readingMinutes),
    };
    return {
        totals,
        wordsByEntry: [...entries]
            .sort((a, b) => b.words - a.words)
            .slice(0, 12)
            .map((entry) => ({ label: entry.title || entry.url, value: entry.words })),
        headingsByLevel: ["h1", "h2", "h3", "h4", "h5", "h6"].map((level) => ({
            label: level.toUpperCase(),
            value: sum(entries, (entry) => { var _a, _b; return (_b = (_a = entry.headingsByLevel) === null || _a === void 0 ? void 0 : _a[level]) !== null && _b !== void 0 ? _b : 0; }),
        })),
        byContentType: countBy(entries.map((entry) => entry.contentType || "Unknown")).slice(0, 12),
        wordsByList: sumBy(entries, (entry) => entry.listTitle).slice(0, 12),
        sourceSplit: [
            { label: ContentAuditContent.sources.page, value: totals.pages },
            { label: ContentAuditContent.sources.item, value: totals.items },
        ],
        issues: entries.filter((entry) => issuesFor(entry, config.thinWordCount).length > 0),
    };
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
function sumBy(entries, key) {
    const totals = new Map();
    entries.forEach((entry) => { var _a; return totals.set(key(entry), ((_a = totals.get(key(entry))) !== null && _a !== void 0 ? _a : 0) + entry.words); });
    return [...totals.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
function sum(entries, read) {
    return entries.reduce((total, entry) => total + read(entry), 0);
}
//# sourceMappingURL=ContentAudit.logic.js.map