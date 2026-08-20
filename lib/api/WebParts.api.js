import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { toErrorMessage } from "../utils/Guard.util";
const SELECT = [
    "Id",
    "Title",
    "FileLeafRef",
    "FileRef",
    "Modified",
    "PageLayoutType",
    "CanvasContent1",
    "LayoutWebpartsContent",
];
const OUT_OF_BOX = {
    "8c88f208-6c77-4bdb-86a0-0c47b4316588": "News",
    "b7dd04e1-19ce-4b24-9132-b60a1c2b910d": "Quick links",
    "c4bd7b2f-7b6e-4599-8485-16504575f590": "Hero",
    "eb95c819-ab8f-4689-bd03-0c2d65d47b1f": "Site activity",
    "f92bf067-bc19-489e-a556-7fe95f508720": "Document library",
    "62cac389-787f-495d-beca-e11786162ef4": "Highlighted content",
    "d1d91016-032f-456d-98a4-721247c305e8": "Image",
    "490d7c76-1824-45b2-9de3-676421c997fa": "Text",
    "3ffab205-cc63-4c1c-9e5b-e896e2d9e2cb": "Divider",
    "8654b4a6-4b6e-4c39-a4a1-9a4b6ee1e2e1": "Spacer",
    "1ef5ed11-ce7b-44be-bc5e-4abd55101d16": "Site activity",
    "cb3bfe97-a47f-47ca-9c37-6f0d0b4a5f47": "List",
    "df8e44e7-edd5-46d5-90da-aca1539313b8": "News feed",
    "7b317bca-c919-4982-af2f-8399173e5a1e": "People",
    "df1cfc50-5b21-4e7b-9b25-4d6a3e2e2fbd": "Events",
    "6410b3b6-d440-4663-8744-378976dc041e": "Events",
    "20477fc9-b52c-4b04-b0e4-5aab4b4bcbb1": "Countdown timer",
    "58fcd18b-e1af-4b0a-b23b-422c2c52d5a2": "Bing maps",
    "f6fdf4f8-4a24-437b-a127-32e66a5dd9b4": "Twitter",
    "544dd15b-cf3c-441b-96da-004d5a8cea1d": "Yammer",
    "c70391ea-0b10-4ee9-b2b4-006d3fcad0cd": "Quick chart",
    "71c19a43-d08c-4178-8218-4df8554c0b8e": "Embed",
    "544e4a15-8d4c-4b3b-9cbd-1de1e0c1cca9": "Button",
    "e377ea37-9047-43b9-8cdb-a761be2f8e09": "Bing news",
    "ceaeb9c5-6a5e-4bbd-a3b7-f0d0c0a0f5d8": "Weather",
    "7f718435-ee4d-431c-bdbf-9c4ff326f46e": "Section background",
    "0f087d7f-520e-42b7-89c0-496aaf979d58": "Group calendar",
    "af5e7ea5-6dab-4d31-b3f4-6ca2e0ac4d3d": "Planner",
    "506b8f9e-5e9d-42fd-9f5b-14c1e8f4e3f5": "Stream",
};
export function PageCanvas(webUrl) {
    return {
        getPages(top) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getByTitle("Site Pages")
                    .items.select(...SELECT)
                    .top(top)(), { label: "PageCanvas.getPages" }));
                return rows.map((row) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        id: Number(row.Id),
                        title: String((_b = (_a = row.Title) !== null && _a !== void 0 ? _a : row.FileLeafRef) !== null && _b !== void 0 ? _b : ""),
                        fileName: String((_c = row.FileLeafRef) !== null && _c !== void 0 ? _c : ""),
                        serverRelativeUrl: String((_d = row.FileRef) !== null && _d !== void 0 ? _d : ""),
                        modified: String((_e = row.Modified) !== null && _e !== void 0 ? _e : ""),
                        pageLayout: String((_f = row.PageLayoutType) !== null && _f !== void 0 ? _f : ""),
                        canvasContent: String((_g = row.CanvasContent1) !== null && _g !== void 0 ? _g : ""),
                        titleAreaContent: String((_h = row.LayoutWebpartsContent) !== null && _h !== void 0 ? _h : ""),
                    });
                });
            });
        },
        parse(page, siteUrl, includeTitleArea) {
            try {
                const instances = [
                    ...parseCanvas(page.canvasContent, page, siteUrl, 0),
                    ...(includeTitleArea ? parseCanvas(page.titleAreaContent, page, siteUrl, 1) : []),
                ];
                return {
                    page,
                    instances,
                    sections: new Set(instances.filter((instance) => instance.layer === 0).map((i) => i.section)).size,
                };
            }
            catch (error) {
                return { page, instances: [], sections: 0, parseError: toErrorMessage(error) };
            }
        },
    };
}
function parseCanvas(html, page, siteUrl, layer) {
    if (!html || html.trim().length === 0)
        return [];
    const document = new DOMParser().parseFromString(html, "text/html");
    const nodes = Array.from(document.querySelectorAll("[data-sp-controldata]"));
    return nodes
        .map((node) => toInstance(node, page, siteUrl, layer))
        .filter((instance) => instance !== undefined);
}
function toInstance(node, page, siteUrl, layer) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const control = readJson(node.getAttribute("data-sp-controldata"));
    if (!control)
        return undefined;
    const webPartData = (_b = readJson((_a = node.querySelector("[data-sp-webpartdata]")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-sp-webpartdata"))) !== null && _b !== void 0 ? _b : control.webPartData;
    const webPartId = ((_d = (_c = control.webPartId) !== null && _c !== void 0 ? _c : webPartData === null || webPartData === void 0 ? void 0 : webPartData.id) !== null && _d !== void 0 ? _d : "").toLowerCase();
    const kind = kindOf(control.controlType, webPartId);
    const properties = ((_e = webPartData === null || webPartData === void 0 ? void 0 : webPartData.properties) !== null && _e !== void 0 ? _e : {});
    const known = OUT_OF_BOX[webPartId];
    const stock = kind !== "webPart";
    return {
        siteUrl,
        pageId: page.id,
        pageTitle: page.title,
        pageUrl: page.serverRelativeUrl,
        instanceId: (_g = (_f = webPartData === null || webPartData === void 0 ? void 0 : webPartData.instanceId) !== null && _f !== void 0 ? _f : control.id) !== null && _g !== void 0 ? _g : `${page.id}-${nodeIndex(node)}`,
        webPartId,
        name: known !== null && known !== void 0 ? known : (kind === "webPart" ? webPartId || "Unknown web part" : labelFor(kind)),
        kind,
        title: (_h = webPartData === null || webPartData === void 0 ? void 0 : webPartData.title) !== null && _h !== void 0 ? _h : "",
        section: (_k = (_j = control.position) === null || _j === void 0 ? void 0 : _j.zoneIndex) !== null && _k !== void 0 ? _k : 0,
        column: (_m = (_l = control.position) === null || _l === void 0 ? void 0 : _l.sectionIndex) !== null && _m !== void 0 ? _m : 0,
        layer,
        propertyKeys: Object.keys(properties).sort(),
        properties,
        isOutOfBox: Boolean(known) || stock,
        isThirdParty: kind === "webPart" && !known && webPartId.length > 0,
    };
}
// Canvas control types: 3 is a client side web part, 4 is the stock text block,
// 0 marks an empty column.
function kindOf(controlType, webPartId) {
    if (controlType === 4)
        return "text";
    if (controlType === 7)
        return "spacer";
    if (webPartId === "d1d91016-032f-456d-98a4-721247c305e8")
        return "image";
    if (controlType === 3)
        return "webPart";
    if (controlType === 0 || controlType === undefined)
        return "unknown";
    return "webPart";
}
function labelFor(kind) {
    if (kind === "text")
        return "Text (stock)";
    if (kind === "image")
        return "Image";
    if (kind === "spacer")
        return "Spacer";
    return "Unknown control";
}
function nodeIndex(node) {
    var _a, _b;
    return Array.prototype.indexOf.call((_b = (_a = node.parentElement) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [], node);
}
function readJson(raw) {
    if (!raw)
        return undefined;
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return undefined;
    }
}
//# sourceMappingURL=WebParts.api.js.map