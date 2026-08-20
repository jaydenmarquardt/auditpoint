import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
import { LinkScanner } from "./Links.api";
/** Depth guard: a config file is a tree, and a malformed one can be a deep tree. */
const MAX_DEPTH = 12;
const URL_VALUE = /^(https?:\/\/|\/[^/\s])/i;
export function ConfigFiles(webUrl) {
    const scanner = LinkScanner(webUrl);
    return {
        /** Configuration lives in the site, so it is read like any other file. */
        read(serverRelativeUrl) {
            return __awaiter(this, void 0, void 0, function* () {
                const text = yield throttled(() => getSp(webUrl).web.getFileByServerRelativePath(serverRelativeUrl).getText(), { label: "ConfigFiles.read" });
                return JSON.parse(text);
            });
        },
        /**
         * Walks the whole document for url shaped strings. Config files hold links in
         * property names nobody agrees on, so the value decides, not the key, and the
         * key path becomes the label so an editor can find it again.
         */
        links(json, fileName) {
            const found = new Map();
            const visit = (value, path, depth) => {
                if (depth > MAX_DEPTH || value === null || value === undefined)
                    return;
                if (typeof value === "string") {
                    const text = value.trim();
                    if (!URL_VALUE.test(text))
                        return;
                    const label = `${fileName}: ${path.join(".")}`;
                    found.set(`${text}|${label}`, scanner.fromUrl(text, "", { source: "config", sourceLabel: label }));
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach((entry, index) => visit(entry, [...path, `[${index}]`], depth + 1));
                    return;
                }
                if (typeof value === "object") {
                    Object.keys(value).forEach((key) => visit(value[key], [...path, key], depth + 1));
                }
            };
            visit(json, [], 0);
            return [...found.values()];
        },
        /**
         * The mega menu is a link source with no page of its own, so its nodes are read
         * as one flat list, each labelled with the trail through the menu that reaches it.
         */
        megaMenuLinks(json, fileName) {
            var _a;
            const root = (_a = json === null || json === void 0 ? void 0 : json.megamenu) === null || _a === void 0 ? void 0 : _a.items;
            if (!Array.isArray(root))
                return [];
            const walk = (items, trail, depth) => {
                if (depth > MAX_DEPTH)
                    return [];
                return items.flatMap((item) => {
                    var _a, _b;
                    const path = [...trail, item.title || "Untitled"];
                    const self = item.href
                        ? [
                            scanner.fromUrl(item.href, (_a = item.title) !== null && _a !== void 0 ? _a : "", { source: "megamenu", sourceLabel: `${fileName}: ${path.join(" > ")}` }, Boolean(item.newTab)),
                        ]
                        : [];
                    return [...self, ...walk((_b = item.children) !== null && _b !== void 0 ? _b : [], path, depth + 1)];
                });
            };
            return walk(root, [], 0);
        },
    };
}
export function splitPaths(raw) {
    return raw
        .split(/[,;\n]+/)
        .map((path) => path.trim())
        .filter((path) => path.length > 0);
}
//# sourceMappingURL=ConfigFiles.api.js.map