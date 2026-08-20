import * as React from "react";
import { StatTile } from "../../components/layout/StatTile";
import { Theme } from "../../theme/Theme.api";
import { IndexingAuditContent } from "./IndexingAudit.content";
import { formatNumber } from "../../utils/Format.util";
export const IndexingAuditStats = ({ view, config }) => {
    const { totals } = view;
    return (React.createElement("div", { style: {
            display: "flex",
            flexWrap: "wrap",
            gap: Theme.tokens.space.md,
            width: "100%",
            minWidth: 0,
        } },
        React.createElement(StatTile, { iconName: "BulletedList", label: IndexingAuditContent.stats.lists, value: formatNumber(totals.lists), info: IndexingAuditContent.tileInfo.lists }),
        React.createElement(StatTile, { iconName: "Blocked", label: IndexingAuditContent.stats.excluded, value: formatNumber(totals.excluded), tone: "warning", badge: totals.excluded > 0 ? IndexingAuditContent.review : undefined, info: IndexingAuditContent.tileInfo.excluded }),
        React.createElement(StatTile, { iconName: "PieSingle", label: IndexingAuditContent.stats.coverage, value: config.checkCoverage ? `${totals.coveragePercent}%` : "-", info: IndexingAuditContent.tileInfo.coverage }),
        React.createElement(StatTile, { iconName: "SearchAndApps", label: IndexingAuditContent.stats.indexed, value: config.checkCoverage ? formatNumber(totals.indexedItems) : "-", info: IndexingAuditContent.tileInfo.indexed }),
        React.createElement(StatTile, { iconName: "CheckList", label: IndexingAuditContent.stats.expected, value: formatNumber(totals.expectedItems), info: IndexingAuditContent.tileInfo.expected }),
        React.createElement(StatTile, { iconName: "Down", label: IndexingAuditContent.stats.below, value: config.checkCoverage ? formatNumber(totals.listsBelowTarget) : "-", tone: "warning", info: IndexingAuditContent.tileInfo.below }),
        React.createElement(StatTile, { iconName: "Warning", label: IndexingAuditContent.stats.missing, value: config.checkItems ? formatNumber(totals.itemsMissing) : "-", tone: "warning", badge: totals.itemsMissing > 0 ? IndexingAuditContent.review : undefined, info: IndexingAuditContent.tileInfo.missing }),
        React.createElement(StatTile, { iconName: "Clock", label: IndexingAuditContent.stats.stale, value: config.checkItems ? formatNumber(totals.itemsStale) : "-", info: IndexingAuditContent.tileInfo.stale }),
        React.createElement(StatTile, { iconName: "Tag", label: IndexingAuditContent.stats.properties, value: formatNumber(totals.managedProperties), info: IndexingAuditContent.tileInfo.properties })));
};
//# sourceMappingURL=IndexingAudit.stats.js.map