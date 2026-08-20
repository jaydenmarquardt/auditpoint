import { __awaiter } from "tslib";
import { SiteLists } from "../../api/Lists.api";
import { PageCanvas } from "../../api/WebParts.api";
import { ContentSource } from "../../api/Content.api";
import { analyseHtml } from "./ContentAudit.analysis";
import { toErrorMessage } from "../../utils/Guard.util";
export const CONTENT_AUDIT_KIND = "content-audit";
export const contentAuditReport = {
    kind: CONTENT_AUDIT_KIND,
    title: "Content audit",
    description: "Measures the writing itself: words, paragraphs, headings, images, links, tables and embeds across page canvases and rich text columns such as Body or Description.",
    iconName: "TextDocument",
    version: "1.1.0",
    schemaVersion: 1,
    defaultConfig: {
        maxPages: 5000,
        scanListItems: true,
        columnNames: "Body,PageBody,Description,Comments,Content",
        autoDetectColumns: true,
        maxItemsPerList: 5000,
        maxLists: 100,
        thinWordCount: 120,
    },
    configFields: [
        {
            key: "maxPages",
            label: "Maximum pages per site",
            type: "number",
            group: "Limits",
            min: 10,
            max: 20000,
            step: 50,
            description: "Pages are read in one request, then parsed locally.",
        },
        {
            key: "scanListItems",
            label: "Scan rich text columns on lists",
            type: "toggle",
            group: "What to scan",
            description: "Reads list items that carry HTML, such as an event description or a news body.",
        },
        {
            key: "autoDetectColumns",
            label: "Detect rich text columns automatically",
            type: "toggle",
            group: "What to scan",
            description: "Looks at each list's fields for multi line and HTML columns instead of relying on names alone.",
        },
        {
            key: "columnNames",
            label: "Column names to include",
            type: "text",
            group: "Columns and paths",
            multiline: true,
            description: "Comma separated internal names, always checked even when detection is off.",
        },
        {
            key: "maxItemsPerList",
            label: "Maximum items per list",
            type: "number",
            group: "Limits",
            min: 50,
            max: 5000,
            step: 50,
            description: "Caps how many items are read from each list carrying rich text.",
        },
        {
            key: "maxLists",
            label: "Maximum lists per site",
            type: "number",
            group: "Limits",
            min: 5,
            max: 500,
            step: 5,
            description: "Upper bound on lists inspected for rich text columns.",
        },
        {
            key: "thinWordCount",
            label: "Thin content under (words)",
            type: "number",
            group: "Thresholds",
            min: 20,
            max: 2000,
            step: 10,
            description: "Content under this word count is flagged as thin.",
        },
    ],
    stages: [
        {
            key: "pages",
            work: "both",
            label: "Read and measure pages",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const host = hostOf(context.siteUrl);
                    const source = ContentSource(context.siteUrl);
                    const pages = yield PageCanvas(context.siteUrl).getPages(context.config.maxPages);
                    const entries = pages.map((page) => (Object.assign({ siteUrl: context.siteUrl, source: "page", listTitle: "Site Pages", itemId: page.id, column: "CanvasContent1", title: page.title, url: page.serverRelativeUrl, modified: page.modified, contentType: page.pageLayout || "Site Page" }, analyseHtml(source.pageHtml(page), host))));
                    context.data.entries = [...((_a = context.data.entries) !== null && _a !== void 0 ? _a : []), ...entries];
                    context.data.scannedSites = [...((_b = context.data.scannedSites) !== null && _b !== void 0 ? _b : []), context.siteUrl];
                    context.progress(entries.length, entries.length);
                });
            },
        },
        {
            key: "items",
            work: "both",
            label: "Read and measure list content",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    if (!context.config.scanListItems) {
                        context.progress(0, 0);
                        return;
                    }
                    const host = hostOf(context.siteUrl);
                    const source = ContentSource(context.siteUrl);
                    const named = context.config.columnNames
                        .split(/[,;\s]+/)
                        .map((name) => name.trim())
                        .filter(Boolean);
                    const lists = (yield SiteLists(context.siteUrl).getAll(false))
                        .filter((list) => list.title !== "Site Pages" && list.itemCount > 0)
                        .slice(0, context.config.maxLists);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const entries = (_a = context.data.entries) !== null && _a !== void 0 ? _a : [];
                    const columnsSeen = new Set((_b = context.data.columnsScanned) !== null && _b !== void 0 ? _b : []);
                    for (let index = start; index < lists.length; index = index + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index);
                            context.data.entries = entries;
                            return;
                        }
                        const list = lists[index];
                        try {
                            const available = new Set(yield source.fieldNames(list));
                            const detected = context.config.autoDetectColumns
                                ? (yield source.richTextColumns(list)).map((column) => column.internalName)
                                : [];
                            const columns = [...new Set([...named, ...detected])].filter((column) => available.has(column));
                            if (columns.length === 0)
                                continue;
                            const records = yield source.items(list, columns, context.config.maxItemsPerList);
                            records.forEach((record) => {
                                columnsSeen.add(record.column);
                                entries.push(Object.assign({ siteUrl: record.siteUrl, source: "item", listTitle: record.listTitle, itemId: record.itemId, column: record.column, title: record.title, url: record.url, modified: record.modified, contentType: record.contentType }, analyseHtml(record.html, host)));
                            });
                        }
                        catch (error) {
                            context.issue({ target: list.title, code: (_c = statusOf(error)) !== null && _c !== void 0 ? _c : "error", message: toErrorMessage(error) });
                        }
                        context.setCursor(index + 1);
                        context.progress(index + 1, lists.length);
                    }
                    context.data.entries = entries;
                    context.data.columnsScanned = [...columnsSeen];
                });
            },
        },
        {
            key: "summarise",
            work: "client",
            label: "Summarise",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const entries = (_a = context.data.entries) !== null && _a !== void 0 ? _a : [];
                    context.log(`${entries.reduce((sum, entry) => sum + entry.words, 0)} words measured`);
                    context.progress(entries.length, entries.length);
                });
            },
        },
    ],
};
function hostOf(siteUrl) {
    try {
        return new URL(siteUrl).host;
    }
    catch (_a) {
        return window.location.host;
    }
}
function statusOf(error) {
    var _a;
    const candidate = error;
    return (_a = candidate === null || candidate === void 0 ? void 0 : candidate.status) !== null && _a !== void 0 ? _a : candidate === null || candidate === void 0 ? void 0 : candidate.httpStatus;
}
//# sourceMappingURL=ContentAudit.report.js.map