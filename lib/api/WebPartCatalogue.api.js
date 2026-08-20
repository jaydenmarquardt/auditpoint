import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
/** Component manifests installed on the web, used to name and icon each web part. */
export function WebPartCatalogue(webUrl) {
    return {
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const components = yield throttled(() => getSp(webUrl).web.getClientsideWebParts(), {
                    label: "WebPartCatalogue.getAll",
                });
                return components.map((component) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                    const manifest = parse(component.Manifest);
                    const entry = (_a = manifest === null || manifest === void 0 ? void 0 : manifest.preconfiguredEntries) === null || _a === void 0 ? void 0 : _a[0];
                    return {
                        id: String((_b = component.Id) !== null && _b !== void 0 ? _b : "").replace(/[{}]/g, "").toLowerCase(),
                        name: (_c = component.Name) !== null && _c !== void 0 ? _c : "",
                        title: (_f = (_e = (_d = entry === null || entry === void 0 ? void 0 : entry.title) === null || _d === void 0 ? void 0 : _d.default) !== null && _e !== void 0 ? _e : component.Name) !== null && _f !== void 0 ? _f : "",
                        description: (_h = (_g = entry === null || entry === void 0 ? void 0 : entry.description) === null || _g === void 0 ? void 0 : _g.default) !== null && _h !== void 0 ? _h : "",
                        iconName: (_j = entry === null || entry === void 0 ? void 0 : entry.officeFabricIconFontName) !== null && _j !== void 0 ? _j : "",
                        iconUrl: (_k = entry === null || entry === void 0 ? void 0 : entry.iconImageUrl) !== null && _k !== void 0 ? _k : "",
                        group: (_m = (_l = entry === null || entry === void 0 ? void 0 : entry.group) === null || _l === void 0 ? void 0 : _l.default) !== null && _m !== void 0 ? _m : "",
                        alias: (_o = manifest === null || manifest === void 0 ? void 0 : manifest.alias) !== null && _o !== void 0 ? _o : "",
                        version: (_p = manifest === null || manifest === void 0 ? void 0 : manifest.version) !== null && _p !== void 0 ? _p : "",
                        componentType: Number((_q = component.ComponentType) !== null && _q !== void 0 ? _q : 0),
                        status: Number((_r = component.Status) !== null && _r !== void 0 ? _r : 0),
                        isInternal: Boolean(manifest === null || manifest === void 0 ? void 0 : manifest.isInternal),
                    };
                });
            });
        },
    };
}
function parse(manifest) {
    if (!manifest)
        return undefined;
    try {
        return JSON.parse(manifest);
    }
    catch (_a) {
        return undefined;
    }
}
//# sourceMappingURL=WebPartCatalogue.api.js.map