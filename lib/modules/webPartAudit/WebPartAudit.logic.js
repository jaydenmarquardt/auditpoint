export function buildView(data) {
    var _a, _b, _c;
    const instances = (_a = data === null || data === void 0 ? void 0 : data.instances) !== null && _a !== void 0 ? _a : [];
    const pages = (_b = data === null || data === void 0 ? void 0 : data.pages) !== null && _b !== void 0 ? _b : [];
    const catalogue = (_c = data === null || data === void 0 ? void 0 : data.catalogue) !== null && _c !== void 0 ? _c : [];
    const types = summariseTypes(instances, catalogue);
    const pagesWithContent = pages.filter((page) => page.webPartCount > 0).length;
    const used = new Set(types.map((type) => type.webPartId));
    return {
        totals: {
            pages: pages.length,
            pagesWithContent,
            emptyPages: pages.length - pagesWithContent,
            instances: instances.length,
            types: types.length,
            outOfBox: types.filter((type) => type.isOutOfBox).length,
            thirdParty: types.filter((type) => type.isThirdParty).length,
            textBlocks: instances.filter((instance) => instance.kind === "text").length,
            instancesStock: instances.filter((instance) => instance.kind !== "webPart").length,
            instancesThirdParty: instances.filter((instance) => instance.kind === "webPart" && instance.isThirdParty).length,
            instancesOutOfBox: instances.filter((instance) => instance.kind === "webPart" && !instance.isThirdParty).length,
            averagePerPage: pages.length === 0 ? 0 : Math.round((instances.length / pages.length) * 10) / 10,
        },
        types,
        catalogueOnly: catalogue
            .filter((entry) => !used.has(entry.id))
            .map((entry) => ({ id: entry.id, title: entry.title, group: entry.group, iconName: entry.iconName }))
            .sort((a, b) => a.title.localeCompare(b.title)),
        topTypes: types.slice(0, 10).map((type) => ({ label: type.name, value: type.instances })),
        busiestPages: [...pages].sort((a, b) => b.webPartCount - a.webPartCount).slice(0, 10),
        layoutSplit: countBy(pages.map((page) => page.pageLayout || "Unknown")),
    };
}
export function summariseTypes(instances, catalogue) {
    const entries = new Map(catalogue.map((entry) => [entry.id, entry]));
    const grouped = new Map();
    instances.forEach((instance) => {
        var _a;
        const key = instance.webPartId || instance.name;
        grouped.set(key, [...((_a = grouped.get(key)) !== null && _a !== void 0 ? _a : []), instance]);
    });
    return [...grouped.entries()]
        .map(([key, group]) => {
        var _a, _b, _c, _d;
        const first = group[0];
        const entry = entries.get(first.webPartId);
        const propertyKeys = [...new Set(group.flatMap((instance) => instance.propertyKeys))].sort();
        return {
            key,
            name: (entry === null || entry === void 0 ? void 0 : entry.title) || first.name,
            webPartId: first.webPartId,
            instances: group.length,
            pages: new Set(group.map((instance) => `${instance.siteUrl}-${instance.pageId}`)).size,
            isOutOfBox: first.isOutOfBox || Boolean(entry === null || entry === void 0 ? void 0 : entry.isInternal),
            isThirdParty: first.isThirdParty,
            propertyKeys,
            commonPropertyKeys: propertyKeys.filter((property) => group.every((instance) => instance.propertyKeys.indexOf(property) !== -1)),
            sharedValues: sharedValues(group, propertyKeys),
            iconName: (_a = entry === null || entry === void 0 ? void 0 : entry.iconName) !== null && _a !== void 0 ? _a : "",
            iconUrl: (_b = entry === null || entry === void 0 ? void 0 : entry.iconUrl) !== null && _b !== void 0 ? _b : "",
            description: (_c = entry === null || entry === void 0 ? void 0 : entry.description) !== null && _c !== void 0 ? _c : "",
            group: (_d = entry === null || entry === void 0 ? void 0 : entry.group) !== null && _d !== void 0 ? _d : "",
            inCatalogue: Boolean(entry),
        };
    })
        .sort((a, b) => b.instances - a.instances);
}
/** Keys every instance carries with the same value: the shared configuration. */
function sharedValues(group, propertyKeys) {
    if (group.length < 2)
        return [];
    return propertyKeys
        .map((key) => {
        const values = group.map((instance) => stringify(instance.properties[key]));
        const unique = new Set(values);
        return unique.size === 1 && values[0] !== "" ? { key, value: values[0] } : undefined;
    })
        .filter((entry) => entry !== undefined)
        .slice(0, 12);
}
export function propertyUsage(instances) {
    const keys = [...new Set(instances.flatMap((instance) => instance.propertyKeys))];
    return keys
        .map((key) => {
        const withKey = instances.filter((instance) => instance.propertyKeys.indexOf(key) !== -1);
        const counts = new Map();
        withKey.forEach((instance) => {
            var _a;
            const value = stringify(instance.properties[key]);
            if (value)
                counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1);
        });
        return {
            key,
            present: withKey.length,
            percent: instances.length === 0 ? 0 : Math.round((withKey.length / instances.length) * 100),
            topValues: [...counts.entries()]
                .map(([value, count]) => ({ value, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5),
        };
    })
        .sort((a, b) => b.present - a.present);
}
export function instancesOfType(instances, key) {
    return instances.filter((instance) => (instance.webPartId || instance.name) === key);
}
function stringify(value) {
    if (value === undefined || value === null)
        return "";
    if (typeof value === "object")
        return JSON.stringify(value).slice(0, 120);
    return String(value).slice(0, 120);
}
function countBy(values) {
    const counts = new Map();
    values.forEach((value) => { var _a; return counts.set(value, ((_a = counts.get(value)) !== null && _a !== void 0 ? _a : 0) + 1); });
    return [...counts.entries()]
        .map(([label, value]) => ({ key: label, label, value }))
        .sort((a, b) => b.value - a.value);
}
/** Fluent charts key on the label, so repeated names have to be made unique. */
export function dedupeLabels(points) {
    const seen = new Map();
    return points.map((point) => {
        var _a;
        const count = ((_a = seen.get(point.label)) !== null && _a !== void 0 ? _a : 0) + 1;
        seen.set(point.label, count);
        return count === 1 ? point : Object.assign(Object.assign({}, point), { label: `${point.label} (${count})` });
    });
}
//# sourceMappingURL=WebPartAudit.logic.js.map