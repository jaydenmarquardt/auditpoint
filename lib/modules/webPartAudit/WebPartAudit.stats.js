import * as React from "react";
import { StatSections, compareTiles, sectionsFrom } from "../shared/StatSections";
import { WebPartAuditContent } from "./WebPartAudit.content";
import { formatNumber } from "../../utils/Format.util";
export function statTiles(view) {
    return [
        {
            iconName: "Page", key: "pages",
            label: WebPartAuditContent.stats.pages,
            value: formatNumber(view.totals.pages),
            info: WebPartAuditContent.tileInfo.pages,
        },
        {
            iconName: "Puzzle", key: "instances",
            label: WebPartAuditContent.stats.instances,
            value: formatNumber(view.totals.instances),
            info: WebPartAuditContent.tileInfo.instances,
        },
        {
            iconName: "ContextMenu", key: "types",
            label: WebPartAuditContent.stats.types,
            value: formatNumber(view.totals.types),
            info: WebPartAuditContent.tileInfo.types,
        },
        {
            iconName: "Package", key: "thirdParty",
            label: WebPartAuditContent.stats.thirdParty,
            value: formatNumber(view.totals.thirdParty),
            info: WebPartAuditContent.tileInfo.thirdParty,
            tone: "warning",
            badge: view.totals.thirdParty > 0 ? "Review" : undefined,
        },
        {
            iconName: "Calculator", key: "average",
            label: WebPartAuditContent.stats.average,
            value: String(view.totals.averagePerPage),
            info: WebPartAuditContent.tileInfo.average,
        },
        {
            iconName: "FieldEmpty", key: "empty",
            label: WebPartAuditContent.stats.empty,
            value: formatNumber(view.totals.emptyPages),
            info: WebPartAuditContent.tileInfo.empty,
        },
        {
            iconName: "TextField", key: "text",
            label: WebPartAuditContent.stats.text,
            value: formatNumber(view.totals.textBlocks),
            info: WebPartAuditContent.tileInfo.text,
        },
    ];
}
export const WebPartAuditStats = ({ view, previousTiles }) => (React.createElement(StatSections, { sections: sectionsFrom(compareTiles(statTiles(view), previousTiles), STAT_SECTIONS) }));
/** Grouped so the overview answers one question at a time. */
export const STAT_SECTIONS = [
    { title: "Placement", keys: ["pages", "instances", "types", "average"] },
    { title: "Needs attention", keys: ["thirdParty", "empty", "text"] },
];
//# sourceMappingURL=WebPartAudit.stats.js.map