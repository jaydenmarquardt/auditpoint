import { downloadCsv } from "../../utils/Export.util";
export function instanceRow(instance) {
    return {
        site: instance.siteUrl,
        page: instance.pageTitle,
        pageUrl: instance.pageUrl,
        webPart: instance.name,
        webPartId: instance.webPartId,
        title: instance.title,
        section: instance.section + 1,
        column: instance.column + 1,
        area: instance.layer === 1 ? "title" : "body",
        properties: instance.propertyKeys.join("|"),
    };
}
export function exportWebPartAudit(data) {
    var _a;
    downloadCsv("webpart-audit", ((_a = data === null || data === void 0 ? void 0 : data.instances) !== null && _a !== void 0 ? _a : []).map(instanceRow));
}
export function exportTypeInstances(name, instances) {
    downloadCsv(`webpart-${name.replace(/\s+/g, "-").toLowerCase()}`, instances.map((instance) => ({
        page: instance.pageTitle,
        pageUrl: instance.pageUrl,
        title: instance.title,
        section: instance.section + 1,
        column: instance.column + 1,
        properties: JSON.stringify(instance.properties),
    })));
}
//# sourceMappingURL=WebPartAudit.csv.js.map