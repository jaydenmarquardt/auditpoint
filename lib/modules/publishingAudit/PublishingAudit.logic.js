import { PublishingAuditContent } from "./PublishingAudit.content";
const DAY = 24 * 60 * 60 * 1000;
export function statusLabel(status) {
    if (status === 0)
        return PublishingAuditContent.status.approved;
    if (status === 1)
        return PublishingAuditContent.status.rejected;
    if (status === 2)
        return PublishingAuditContent.status.pending;
    if (status === 3)
        return PublishingAuditContent.status.draft;
    if (status === 4)
        return PublishingAuditContent.status.scheduled;
    return PublishingAuditContent.status.unknown;
}
export function daysSinceEdit(item) {
    if (!item.modified)
        return 0;
    return Math.floor((Date.now() - new Date(item.modified).getTime()) / DAY);
}
export function isStale(item, staleDays) {
    return Boolean(item.modified) && daysSinceEdit(item) > staleDays;
}
/**
 * Nothing published: either moderation is holding it, or its only version is a minor
 * one, which is what a draft looks like on a library with major versions switched on.
 */
export function isUnpublished(item) {
    var _a;
    if (item.moderationStatus === 1 || item.moderationStatus === 2 || item.moderationStatus === 3)
        return true;
    return `${(_a = item.versionLabel) !== null && _a !== void 0 ? _a : ""}`.startsWith("0.");
}
export function reviewDate(item) {
    var _a;
    return (_a = item.dates.ReviewDate) !== null && _a !== void 0 ? _a : item.dates.NextReviewDate;
}
export function expiryDate(item) {
    var _a;
    return (_a = item.dates.ExpiryDate) !== null && _a !== void 0 ? _a : item.dates.ExpirationDate;
}
export function buildView(data, config) {
    var _a, _b;
    const items = (_a = data === null || data === void 0 ? void 0 : data.items) !== null && _a !== void 0 ? _a : [];
    const windowStart = Date.now() - config.months * 30 * DAY;
    const versions = items.map((item) => { var _a; return (_a = item.versionCount) !== null && _a !== void 0 ? _a : 0; }).filter((count) => count > 0);
    const totals = {
        items: items.length,
        approved: items.filter((item) => item.moderationStatus === 0 || item.moderationStatus === undefined).length,
        pending: items.filter((item) => item.moderationStatus === 2).length,
        draft: items.filter((item) => item.moderationStatus === 3).length,
        rejected: items.filter((item) => item.moderationStatus === 1).length,
        scheduled: items.filter((item) => item.moderationStatus === 4).length,
        createdInWindow: items.filter((item) => item.created && new Date(item.created).getTime() >= windowStart).length,
        modifiedInWindow: items.filter((item) => item.modified && new Date(item.modified).getTime() >= windowStart).length,
        stale: items.filter((item) => isStale(item, config.staleDays)).length,
        neverEdited: items.filter((item) => item.created && item.created === item.modified).length,
        dueForReview: items.filter((item) => isPast(reviewDate(item))).length,
        expired: items.filter((item) => isPast(expiryDate(item))).length,
        averageVersions: versions.length === 0 ? 0 : Math.round((versions.reduce((sum, count) => sum + count, 0) / versions.length) * 10) / 10,
        maxVersions: versions.length === 0 ? 0 : Math.max(...versions),
        editors: new Set(items.map((item) => item.editorTitle).filter(Boolean)).size,
        authors: new Set(items.map((item) => item.authorTitle).filter(Boolean)).size,
        unpublished: items.filter(isUnpublished).length,
        versionsScanned: versions.reduce((sum, count) => sum + count, 0),
        itemsVersioned: versions.length,
        lists: (_b = data === null || data === void 0 ? void 0 : data.listCount) !== null && _b !== void 0 ? _b : new Set(items.map((item) => item.listId)).size,
    };
    return {
        totals,
        createdByMonth: byMonth(items.map((item) => item.created), config.months),
        modifiedByMonth: byMonth(items.map((item) => item.modified), config.months),
        modifiedByWeekday: byWeekday(items.map((item) => item.modified)),
        statusSplit: countBy(items.map((item) => statusLabel(item.moderationStatus))),
        topEditors: countBy(items.map((item) => item.editorTitle).filter(Boolean)).slice(0, 12),
        stalenessSplit: bucketAges(items),
        itemsByList: countBy(items.map((item) => item.listTitle)).slice(0, 12),
        people: peopleFrom(items, config.staleDays),
        unpublishedItems: items.filter(isUnpublished),
        reviewItems: items.filter((item) => reviewDate(item) || expiryDate(item)),
        staleItems: items.filter((item) => isStale(item, config.staleDays)),
    };
}
/**
 * Everyone who created or last edited something, with their own slice of the scan.
 * Authors and editors share one list: people ask "what has Jo touched", not "what did
 * Jo touch as an editor".
 */
export function peopleFrom(items, staleDays) {
    const byName = new Map();
    const ensure = (name) => {
        const existing = byName.get(name);
        if (existing)
            return existing;
        const created = {
            name,
            created: 0,
            edited: 0,
            unpublished: 0,
            stale: 0,
            lists: [],
            lastEdit: "",
            items: [],
        };
        byName.set(name, created);
        return created;
    };
    const touch = (person, item) => {
        if (person.items.indexOf(item) === -1)
            person.items.push(item);
        if (item.listTitle && person.lists.indexOf(item.listTitle) === -1)
            person.lists.push(item.listTitle);
        if (item.modified && item.modified > person.lastEdit)
            person.lastEdit = item.modified;
        if (isUnpublished(item))
            person.unpublished = person.unpublished + 1;
        if (isStale(item, staleDays))
            person.stale = person.stale + 1;
    };
    items.forEach((item) => {
        if (item.authorTitle) {
            const author = ensure(item.authorTitle);
            author.created = author.created + 1;
            touch(author, item);
        }
        if (item.editorTitle) {
            const editor = ensure(item.editorTitle);
            editor.edited = editor.edited + 1;
            touch(editor, item);
        }
    });
    return [...byName.values()].sort((first, second) => second.items.length - first.items.length);
}
function isPast(iso) {
    if (!iso)
        return false;
    const time = new Date(iso).getTime();
    return Number.isFinite(time) && time < Date.now();
}
function bucketAges(items) {
    const buckets = {
        [PublishingAuditContent.buckets.month]: 0,
        [PublishingAuditContent.buckets.quarter]: 0,
        [PublishingAuditContent.buckets.year]: 0,
        [PublishingAuditContent.buckets.older]: 0,
    };
    items.forEach((item) => {
        const days = daysSinceEdit(item);
        if (days <= 30)
            buckets[PublishingAuditContent.buckets.month] += 1;
        else if (days <= 90)
            buckets[PublishingAuditContent.buckets.quarter] += 1;
        else if (days <= 365)
            buckets[PublishingAuditContent.buckets.year] += 1;
        else
            buckets[PublishingAuditContent.buckets.older] += 1;
    });
    return Object.entries(buckets).map(([label, value]) => ({ label, value }));
}
function byMonth(dates, months) {
    const buckets = new Map();
    const now = new Date();
    for (let index = months - 1; index >= 0; index = index - 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
        buckets.set(date.toLocaleDateString(undefined, { month: "short", year: "2-digit" }), 0);
    }
    dates.forEach((iso) => {
        var _a;
        if (!iso)
            return;
        const key = new Date(iso).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
        if (buckets.has(key))
            buckets.set(key, ((_a = buckets.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    });
    return [...buckets.entries()].map(([label, value]) => ({ label, value }));
}
function byWeekday(dates) {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);
    dates.forEach((iso) => {
        if (!iso)
            return;
        const date = new Date(iso);
        if (Number.isFinite(date.getTime()))
            counts[date.getDay()] += 1;
    });
    return names.map((label, index) => ({ label, value: counts[index] }));
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
}
//# sourceMappingURL=PublishingAudit.logic.js.map