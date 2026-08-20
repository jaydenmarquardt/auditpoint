import * as React from "react";
import { StatTile } from "../../components/layout/StatTile";
import { Theme } from "../../theme/Theme.api";
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
export const WebPartAuditStats = ({ view }) => (React.createElement("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: Theme.tokens.space.md,
        width: "100%",
        minWidth: 0,
    } }, statTiles(view).map((tile) => (React.createElement(StatTile, { key: tile.key, iconName: tile.iconName, label: tile.label, value: tile.value, info: tile.info, tone: tile.tone, badge: tile.badge })))));
//# sourceMappingURL=WebPartAudit.stats.js.map