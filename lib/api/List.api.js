import { __asyncValues, __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
const PAGE_SIZE = 500;
/** Define fields plus a row mapper; get a `Thing()` / `Thing(siteUrl)` factory. */
export function createListApi(definition) {
    return (webUrl) => {
        const list = () => getSp(webUrl).web.lists.getByTitle(definition.title);
        const base = (query) => {
            var _a, _b;
            let items = list().items.select(...definition.select);
            if ((_a = definition.expand) === null || _a === void 0 ? void 0 : _a.length)
                items = items.expand(...definition.expand);
            if (query === null || query === void 0 ? void 0 : query.filter)
                items = items.filter(query.filter);
            if (query === null || query === void 0 ? void 0 : query.orderBy)
                items = items.orderBy(query.orderBy.field, query.orderBy.ascending !== false);
            items = items.top((_b = query === null || query === void 0 ? void 0 : query.top) !== null && _b !== void 0 ? _b : PAGE_SIZE);
            return items;
        };
        return {
            webUrl,
            title: definition.title,
            getItems(query) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, e_1, _b, _c;
                    if (!(query === null || query === void 0 ? void 0 : query.all)) {
                        const rows = (yield throttled(() => base(query)(), {
                            label: `${definition.title}.getItems`,
                        }));
                        return rows.map(definition.map);
                    }
                    const collected = [];
                    try {
                        for (var _d = true, _e = __asyncValues(base(query)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                            _c = _f.value;
                            _d = false;
                            const page = _c;
                            collected.push(...page.map(definition.map));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return collected;
                });
            },
            getItem(id) {
                return __awaiter(this, void 0, void 0, function* () {
                    const item = list().items.getById(id).select(...definition.select);
                    const row = (yield throttled(() => { var _a; return (((_a = definition.expand) === null || _a === void 0 ? void 0 : _a.length) ? item.expand(...definition.expand)() : item()); }, { label: `${definition.title}.getItem`, priority: true }));
                    return definition.map(row);
                });
            },
            count(filter) {
                return __awaiter(this, void 0, void 0, function* () {
                    const items = filter ? list().items.filter(filter) : list().items;
                    const rows = (yield throttled(() => items.select("Id").top(5000)(), {
                        label: `${definition.title}.count`,
                    }));
                    return rows.length;
                });
            },
            exists() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield throttled(() => list().select("Id")(), { label: `${definition.title}.exists`, priority: true });
                        return true;
                    }
                    catch (_a) {
                        return false;
                    }
                });
            },
        };
    };
}
//# sourceMappingURL=List.api.js.map