import { __awaiter } from "tslib";
import { getSp } from "./Sp.api";
import { throttled } from "./Throttle.api";
const INDEX_PROPERTIES = [
    "Title",
    "Path",
    "LastModifiedTime",
    "Created",
    "Author",
    "FileType",
    "contentclass",
    "SPWebUrl",
    "IsDocument",
    "ListItemID",
];
export function Search(webUrl) {
    return {
        run(request) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const started = Date.now();
                const results = yield throttled(() => getSp(webUrl).search({
                    Querytext: request.queryText || "*",
                    RowLimit: request.rowLimit,
                    StartRow: request.startRow,
                    SelectProperties: request.selectProperties,
                    SortList: request.sort
                        ? [{ Property: request.sort.property, Direction: request.sort.descending ? 1 : 0 }]
                        : undefined,
                    TrimDuplicates: request.trimDuplicates,
                    EnableStemming: request.enableStemming,
                    Refiners: request.refiners.length > 0 ? request.refiners.join(",") : undefined,
                    RefinementFilters: request.refinementFilters.length > 0 ? request.refinementFilters : undefined,
                    SourceId: request.sourceId || undefined,
                    QueryTemplate: request.queryTemplate || undefined,
                    Culture: request.culture,
                    ClientType: "ContentSearchRegular",
                }), { label: "Search.run", priority: true });
                const rows = ((_a = results.PrimarySearchResults) !== null && _a !== void 0 ? _a : []);
                return {
                    queryText: request.queryText,
                    rows,
                    properties: propertiesOf(rows, request.selectProperties),
                    totalRows: (_b = results.TotalRows) !== null && _b !== void 0 ? _b : rows.length,
                    totalIncludingDuplicates: (_c = results.TotalRowsIncludingDuplicates) !== null && _c !== void 0 ? _c : rows.length,
                    elapsedMs: Date.now() - started,
                    refiners: refinersOf(results.RawSearchResults),
                };
            });
        },
        /** A single path query is the cheapest way to ask "does the index know this". */
        isIndexed(target) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const started = Date.now();
                const queryText = `Path:"${target.trim()}"`;
                const results = yield throttled(() => getSp(webUrl).search({
                    Querytext: queryText,
                    RowLimit: 1,
                    SelectProperties: INDEX_PROPERTIES,
                    TrimDuplicates: false,
                    ClientType: "ContentSearchRegular",
                }), { label: "Search.isIndexed", priority: true });
                const row = ((_a = results.PrimarySearchResults) !== null && _a !== void 0 ? _a : [])[0];
                return {
                    target,
                    indexed: Boolean(row),
                    queryText,
                    row,
                    elapsedMs: Date.now() - started,
                };
            });
        },
        managedProperties() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const results = yield throttled(() => getSp(webUrl).search({
                    Querytext: "*",
                    RowLimit: 1,
                    TrimDuplicates: false,
                    ClientType: "ContentSearchRegular",
                }), { label: "Search.properties", priority: true });
                const row = ((_a = results.PrimarySearchResults) !== null && _a !== void 0 ? _a : [])[0];
                return row ? Object.keys(row).sort() : [];
            });
        },
    };
}
function propertiesOf(rows, requested) {
    if (rows.length === 0)
        return requested;
    const keys = new Set(requested);
    rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)));
    return [...keys];
}
function refinersOf(raw) {
    var _a, _b, _c;
    const refiners = (_c = (_b = (_a = raw === null || raw === void 0 ? void 0 : raw.PrimaryQueryResult) === null || _a === void 0 ? void 0 : _a.RefinementResults) === null || _b === void 0 ? void 0 : _b.Refiners) !== null && _c !== void 0 ? _c : [];
    return refiners.map((refiner) => {
        var _a;
        return ({
            name: refiner.Name,
            entries: ((_a = refiner.Entries) !== null && _a !== void 0 ? _a : []).map((entry) => {
                var _a;
                return ({
                    value: entry.RefinementName || entry.RefinementValue,
                    token: entry.RefinementToken,
                    count: Number((_a = entry.RefinementCount) !== null && _a !== void 0 ? _a : 0),
                });
            }),
        });
    });
}
//# sourceMappingURL=Search.api.js.map