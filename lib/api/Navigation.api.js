import { __awaiter } from "tslib";
import "@pnp/sp/navigation";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
/** Menus are shallow in practice, so the walk stops rather than chasing a loop. */
const MAX_DEPTH = 4;
export function SiteNavigation(webUrl) {
    return {
        /**
         * Navigation is a link source with no page of its own, so it is scanned like any
         * other content and folded in as one synthetic reference.
         */
        links() {
            return __awaiter(this, void 0, void 0, function* () {
                const [quickLaunch, topNav] = yield Promise.all([
                    nodes(webUrl, "quicklaunch"),
                    nodes(webUrl, "topNavigationBar"),
                ]);
                return [...flatten(quickLaunch, "Quick launch", []), ...flatten(topNav, "Top navigation", [])];
            });
        },
    };
}
function nodes(webUrl, menu) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return (yield throttled(() => getSp(webUrl).web.navigation[menu].expand("Children")(), { label: `Navigation.${menu}` }));
        }
        catch (_a) {
            // A site with navigation switched off is not a scan failure.
            return [];
        }
    });
}
function flatten(list, menu, trail, depth = 0) {
    if (depth >= MAX_DEPTH)
        return [];
    return list.flatMap((node) => {
        var _a, _b;
        const title = (_a = node.Title) !== null && _a !== void 0 ? _a : "Untitled";
        const path = [...trail, title];
        const self = node.Url
            ? [{ url: node.Url, text: title, path: path.join(" > "), menu }]
            : [];
        return [...self, ...flatten((_b = node.Children) !== null && _b !== void 0 ? _b : [], menu, path, depth + 1)];
    });
}
//# sourceMappingURL=Navigation.api.js.map