import { __awaiter } from "tslib";
import { PageCanvas } from "../../api/WebParts.api";
import { WebPartCatalogue } from "../../api/WebPartCatalogue.api";
import { toErrorMessage } from "../../utils/Guard.util";
export const WEBPART_AUDIT_KIND = "webpart-audit";
export const webPartAuditReport = {
    kind: WEBPART_AUDIT_KIND,
    title: "Web part audit",
    description: "Reads every page canvas and extracts the web parts used, their placement and their properties.",
    iconName: "Puzzle",
    version: "1.3.0",
    schemaVersion: 2,
    defaultConfig: {
        maxPages: 5000,
        includeTitleArea: true,
        keepProperties: true,
        readCatalogue: true,
    },
    configFields: [
        {
            key: "maxPages",
            label: "Maximum pages per site",
            type: "number",
            min: 10,
            max: 20000,
            step: 100,
            description: "Pages are read in one request, so a high cap is cheap. Parsing is what takes the time.",
        },
        {
            key: "includeTitleArea",
            label: "Include page title area",
            type: "toggle",
            description: "Counts web parts placed in the banner area as well as the page body.",
        },
        {
            key: "keepProperties",
            label: "Keep full web part properties",
            type: "toggle",
            description: "Stores every saved property on each instance. Off keeps the report small when pages are complex.",
        },
        {
            key: "readCatalogue",
            label: "Read the web part catalogue for names and icons",
            type: "toggle",
            description: "Resolves component ids to real names, icons and groups, and finds installed web parts nobody uses.",
        },
    ],
    stages: [
        {
            key: "catalogue",
            label: "Read web part catalogue",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (!context.config.readCatalogue) {
                        context.progress(0, 0);
                        return;
                    }
                    try {
                        const entries = yield WebPartCatalogue(context.siteUrl).getAll();
                        const existing = (_a = context.data.catalogue) !== null && _a !== void 0 ? _a : [];
                        const merged = new Map(existing.map((entry) => [entry.id, entry]));
                        entries.forEach((entry) => merged.set(entry.id, entry));
                        context.data.catalogue = [...merged.values()];
                        context.progress(entries.length, entries.length);
                    }
                    catch (error) {
                        context.issue({ target: context.siteUrl, code: "error", message: toErrorMessage(error) });
                    }
                });
            },
        },
        {
            key: "pages",
            label: "Read pages",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const pages = yield PageCanvas(context.siteUrl).getPages(context.config.maxPages);
                    context.data.rawPages = [...((_a = context.data.rawPages) !== null && _a !== void 0 ? _a : []), ...pages.map((page) => (Object.assign(Object.assign({}, page), { siteUrl: context.siteUrl })))];
                    context.data.scannedSites = [...((_b = context.data.scannedSites) !== null && _b !== void 0 ? _b : []), context.siteUrl];
                    context.progress(pages.length, pages.length);
                });
            },
        },
        {
            key: "canvas",
            label: "Extract web parts",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    const pages = ((_a = context.data.rawPages) !== null && _a !== void 0 ? _a : []).filter((page) => page.siteUrl === context.siteUrl);
                    const canvas = PageCanvas(context.siteUrl);
                    const start = typeof context.cursor === "number" ? context.cursor : 0;
                    const instances = (_b = context.data.instances) !== null && _b !== void 0 ? _b : [];
                    const summaries = (_c = context.data.pages) !== null && _c !== void 0 ? _c : [];
                    for (let index = start; index < pages.length; index = index + 1) {
                        yield context.waitIfPaused();
                        if (context.isCancelled()) {
                            context.setCursor(index);
                            context.data.instances = instances;
                            context.data.pages = summaries;
                            return;
                        }
                        const page = pages[index];
                        const parsed = canvas.parse(page, context.siteUrl, context.config.includeTitleArea);
                        if (parsed.parseError) {
                            context.issue({ target: page.serverRelativeUrl, code: "error", message: parsed.parseError });
                        }
                        const catalogue = new Map(((_d = context.data.catalogue) !== null && _d !== void 0 ? _d : []).map((entry) => [entry.id, entry]));
                        const kept = parsed.instances.map((instance) => {
                            const entry = catalogue.get(instance.webPartId);
                            return Object.assign(Object.assign({}, instance), { name: (entry === null || entry === void 0 ? void 0 : entry.title) || instance.name, isOutOfBox: instance.isOutOfBox || Boolean(entry && entry.isInternal), isThirdParty: instance.kind === "webPart" && Boolean(entry) && !(entry === null || entry === void 0 ? void 0 : entry.isInternal) && !instance.isOutOfBox, properties: context.config.keepProperties ? instance.properties : {} });
                        });
                        instances.push(...kept);
                        summaries.push({
                            siteUrl: context.siteUrl,
                            pageId: page.id,
                            title: page.title,
                            url: page.serverRelativeUrl,
                            modified: page.modified,
                            pageLayout: page.pageLayout,
                            webPartCount: parsed.instances.length,
                            sections: parsed.sections,
                            distinctTypes: new Set(parsed.instances.map((instance) => instance.name)).size,
                            parseError: parsed.parseError,
                        });
                        context.setCursor(index + 1);
                        context.progress(index + 1, pages.length);
                    }
                    context.data.instances = instances;
                    context.data.pages = summaries;
                });
            },
        },
        {
            key: "summarise",
            label: "Summarise",
            run(context) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    // Raw canvas HTML is large; drop it once web parts are extracted.
                    context.data.rawPages = [];
                    context.progress((_b = (_a = context.data.instances) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0, (_d = (_c = context.data.instances) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0);
                });
            },
        },
    ],
};
//# sourceMappingURL=WebPartAudit.report.js.map