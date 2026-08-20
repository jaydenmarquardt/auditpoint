import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "tiff", "tif", "ico", "avif"];
export function ImageFiles(webUrl) {
    const site = webUrl !== null && webUrl !== void 0 ? webUrl : "";
    return {
        inLibrary(list, max) {
            return __awaiter(this, void 0, void 0, function* () {
                const rows = (yield throttled(() => getSp(webUrl)
                    .web.lists.getById(list.id)
                    .items.select("Id", "FileLeafRef", "FileRef", "Modified", "File/Length")
                    .expand("File")
                    .top(max)(), { label: "Images.inLibrary" }));
                return rows
                    .map((row) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        siteUrl: site,
                        listTitle: list.title,
                        name: String((_a = row.FileLeafRef) !== null && _a !== void 0 ? _a : ""),
                        url: String((_b = row.FileRef) !== null && _b !== void 0 ? _b : ""),
                        extension: extensionOf(String((_c = row.FileLeafRef) !== null && _c !== void 0 ? _c : "")),
                        sizeBytes: Number((_e = (_d = row.File) === null || _d === void 0 ? void 0 : _d.Length) !== null && _e !== void 0 ? _e : 0),
                        modified: String((_f = row.Modified) !== null && _f !== void 0 ? _f : ""),
                    });
                })
                    .filter((file) => IMAGE_EXTENSIONS.indexOf(file.extension) !== -1);
            });
        },
        /** Reads the img tags out of stored HTML, keeping alt text and sizing hints. */
        fromHtml(html, context) {
            if (!html || html.trim().length === 0)
                return [];
            const document = new DOMParser().parseFromString(html, "text/html");
            return Array.from(document.querySelectorAll("img")).map((image) => {
                var _a, _b, _c, _d;
                const src = ((_a = image.getAttribute("src")) !== null && _a !== void 0 ? _a : "").trim();
                const alt = ((_b = image.getAttribute("alt")) !== null && _b !== void 0 ? _b : "").trim();
                return Object.assign(Object.assign({}, context), { src, path: normalisePath(src), alt, hasAlt: alt.length > 0, width: (_c = image.getAttribute("width")) !== null && _c !== void 0 ? _c : "", height: (_d = image.getAttribute("height")) !== null && _d !== void 0 ? _d : "", isExternal: isExternal(src, site) });
            });
        },
    };
}
export function normalisePath(src) {
    if (!src)
        return "";
    try {
        const url = /^https?:\/\//i.test(src) ? new URL(src) : new URL(src, "https://placeholder.local");
        return decodeURIComponent(url.pathname).toLowerCase();
    }
    catch (_a) {
        return src.split("?")[0].toLowerCase();
    }
}
function isExternal(src, siteUrl) {
    if (!/^https?:\/\//i.test(src))
        return false;
    try {
        return new URL(src).host.toLowerCase() !== new URL(siteUrl || window.location.href).host.toLowerCase();
    }
    catch (_a) {
        return false;
    }
}
function extensionOf(fileName) {
    const match = /\.([a-z0-9]{1,6})$/i.exec(fileName);
    return match ? match[1].toLowerCase() : "";
}
//# sourceMappingURL=Images.api.js.map