import { normalisePath } from "../../api/Images.api";
import { ImagesAuditContent } from "./ImagesAudit.content";
const LEGACY_FORMATS = ["bmp", "tiff", "tif", "ico"];
const KB = 1024;
export function buildView(data, config) {
    var _a, _b;
    const files = (_a = data === null || data === void 0 ? void 0 : data.files) !== null && _a !== void 0 ? _a : [];
    const usages = (_b = data === null || data === void 0 ? void 0 : data.usages) !== null && _b !== void 0 ? _b : [];
    const oversizedBytes = config.largeImageKb * KB;
    const usesByPath = new Map();
    usages.forEach((usage) => {
        var _a;
        const key = normalisePath(usage.path || usage.src);
        if (key)
            usesByPath.set(key, ((_a = usesByPath.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    });
    // Three ways of spotting the same picture twice, since the bytes cannot be read
    // from the browser: identical size and name, identical size alone, or the same
    // name once a copy suffix is stripped.
    const byExact = new Map();
    const bySize = new Map();
    const byName = new Map();
    files.forEach((file) => {
        push(byExact, exactKey(file), file);
        if (file.sizeBytes > 0)
            push(bySize, sizeKey(file), file);
        push(byName, nameKey(file), file);
    });
    const views = files.map((file) => {
        var _a, _b, _c, _d;
        const key = exactKey(file);
        const useCount = (_a = usesByPath.get(file.url.toLowerCase())) !== null && _a !== void 0 ? _a : 0;
        const sameBytes = ((_b = bySize.get(sizeKey(file))) !== null && _b !== void 0 ? _b : []).filter((other) => other.url !== file.url);
        const sameName = ((_c = byName.get(nameKey(file))) !== null && _c !== void 0 ? _c : []).filter((other) => other.url !== file.url);
        const sameBoth = ((_d = byExact.get(key)) !== null && _d !== void 0 ? _d : []).filter((other) => other.url !== file.url);
        const confidence = sameBoth.length > 0 ? "certain" : sameBytes.length > 0 ? "likely" : sameName.length > 0 ? "possible" : "none";
        return Object.assign(Object.assign({}, file), { useCount, duplicateKey: key, duplicateConfidence: confidence, duplicateOf: [...new Set([...sameBoth, ...sameBytes, ...sameName].map((other) => other.url))].slice(0, 20), isDuplicate: confidence === "certain" || confidence === "likely", isUnused: useCount === 0, isOversized: file.sizeBytes > oversizedBytes, isLegacyFormat: LEGACY_FORMATS.indexOf(file.extension) !== -1 });
    });
    const unused = views.filter((file) => file.isUnused);
    const duplicates = views.filter((file) => file.isDuplicate);
    const totals = {
        files: views.length,
        storageBytes: sum(views.map((file) => file.sizeBytes)),
        usages: usages.length,
        usedFiles: views.filter((file) => file.useCount > 0).length,
        unusedFiles: unused.length,
        unusedBytes: sum(unused.map((file) => file.sizeBytes)),
        duplicateFiles: duplicates.length,
        duplicateBytes: sum(duplicates.map((file) => file.sizeBytes)),
        missingAlt: usages.filter((usage) => !usage.hasAlt).length,
        externalImages: usages.filter((usage) => usage.isExternal).length,
        oversized: views.filter((file) => file.isOversized).length,
        legacyFormats: views.filter((file) => file.isLegacyFormat).length,
        averageBytes: views.length === 0 ? 0 : Math.round(sum(views.map((file) => file.sizeBytes)) / views.length),
        formats: new Set(views.map((file) => file.extension)).size,
    };
    return {
        totals,
        filesByFormat: countBy(views.map((file) => file.extension || "unknown")),
        storageByFormat: sumBy(views.map((file) => ({ key: file.extension || "unknown", value: file.sizeBytes }))),
        usageByPage: countBy(usages.map((usage) => usage.title || usage.pageUrl)).slice(0, 12),
        altSplit: [
            { label: ImagesAuditContent.withAlt, value: usages.length - totals.missingAlt },
            { label: ImagesAuditContent.withoutAlt, value: totals.missingAlt },
        ],
        sizeBuckets: bucketSizes(views.map((file) => file.sizeBytes)),
        usageSplit: [
            { label: ImagesAuditContent.used, value: totals.usedFiles },
            { label: ImagesAuditContent.unused, value: totals.unusedFiles },
        ],
        files: views,
        duplicates,
        unused,
    };
}
export function flagsFor(file) {
    const flags = [];
    if (file.isUnused)
        flags.push(ImagesAuditContent.flags.unused);
    if (file.isDuplicate)
        flags.push(ImagesAuditContent.flags.duplicate);
    if (file.isOversized)
        flags.push(ImagesAuditContent.flags.oversized);
    if (file.isLegacyFormat)
        flags.push(ImagesAuditContent.flags.legacy);
    return flags;
}
function bucketSizes(sizes) {
    const buckets = {
        [ImagesAuditContent.buckets.small]: 0,
        [ImagesAuditContent.buckets.medium]: 0,
        [ImagesAuditContent.buckets.large]: 0,
        [ImagesAuditContent.buckets.huge]: 0,
    };
    sizes.forEach((size) => {
        if (size < 100 * KB)
            buckets[ImagesAuditContent.buckets.small] += 1;
        else if (size < 500 * KB)
            buckets[ImagesAuditContent.buckets.medium] += 1;
        else if (size < 2 * KB * KB)
            buckets[ImagesAuditContent.buckets.large] += 1;
        else
            buckets[ImagesAuditContent.buckets.huge] += 1;
    });
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
function sumBy(entries) {
    const totals = new Map();
    entries.forEach((entry) => { var _a; return totals.set(entry.key, ((_a = totals.get(entry.key)) !== null && _a !== void 0 ? _a : 0) + entry.value); });
    return [...totals.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
/** `logo (1).png`, `logo-copy.png` and `logo_2.png` are all the same picture's name. */
function nameKey(file) {
    return file.name
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/, "")
        .replace(/[ _-]*(copy|copy \d+|\(\d+\)|\d+)$/, "")
        .trim();
}
function sizeKey(file) {
    return `${file.extension}|${file.sizeBytes}`;
}
function exactKey(file) {
    return `${nameKey(file)}|${file.sizeBytes}`;
}
function push(map, key, file) {
    const existing = map.get(key);
    if (existing)
        existing.push(file);
    else
        map.set(key, [file]);
}
function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}
//# sourceMappingURL=ImagesAudit.logic.js.map