import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { IconButton } from "../../components/actions/IconButton";
import { SiteLists } from "../../api/Lists.api";
import { Theme } from "../../theme/Theme.api";
import { IndexingAuditContent } from "./IndexingAudit.content";
import { coveragePercent } from "./IndexingAudit.logic";
import { formatDate, formatNumber } from "../../utils/Format.util";
export function listColumns(target) {
    return [
        {
            key: "title",
            header: IndexingAuditContent.columns.title,
            minWidth: 240,
            maxWidth: 340,
            sortValue: (list) => list.title,
            render: (list) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, list.title),
                React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, list.url))),
        },
        {
            key: "template",
            header: IndexingAuditContent.columns.template,
            minWidth: 150,
            sortValue: (list) => list.templateName,
            filterValue: (list) => list.templateName,
            render: (list) => React.createElement(Badge, { label: list.templateName, tone: "neutral", showIcon: false }),
        },
        {
            key: "crawl",
            header: IndexingAuditContent.columns.crawl,
            minWidth: 130,
            sortValue: (list) => (list.noCrawl ? 1 : 0),
            filterValue: (list) => (list.noCrawl ? IndexingAuditContent.crawl.off : IndexingAuditContent.crawl.on),
            render: (list) => (React.createElement(Badge, { label: list.noCrawl ? IndexingAuditContent.crawl.off : IndexingAuditContent.crawl.on, tone: list.noCrawl ? "danger" : "success" })),
        },
        {
            key: "permissions",
            header: IndexingAuditContent.columns.permissions,
            minWidth: 130,
            sortValue: (list) => (list.hasUniquePermissions ? 1 : 0),
            filterValue: (list) => list.hasUniquePermissions ? IndexingAuditContent.unique : IndexingAuditContent.inherited,
            render: (list) => (React.createElement(Badge, { label: list.hasUniquePermissions ? IndexingAuditContent.unique : IndexingAuditContent.inherited, tone: list.hasUniquePermissions ? "warning" : "neutral" })),
        },
        {
            key: "items",
            header: IndexingAuditContent.columns.items,
            minWidth: 100,
            sortValue: (list) => list.itemCount,
            render: (list) => React.createElement("span", null, formatNumber(list.itemCount)),
        },
        {
            key: "indexed",
            header: IndexingAuditContent.columns.indexed,
            minWidth: 110,
            sortValue: (list) => { var _a; return (_a = list.indexedCount) !== null && _a !== void 0 ? _a : -1; },
            render: (list) => React.createElement("span", null, list.indexedCount === undefined ? "-" : formatNumber(list.indexedCount)),
        },
        {
            key: "coverage",
            header: IndexingAuditContent.columns.coverage,
            minWidth: 130,
            sortValue: (list) => { var _a; return (_a = coveragePercent(list)) !== null && _a !== void 0 ? _a : -1; },
            filterValue: (list) => coverageBand(list, target),
            render: (list) => {
                const percent = coveragePercent(list);
                if (percent === undefined)
                    return React.createElement("span", null, "-");
                return (React.createElement(Badge, { label: `${percent}%`, tone: list.noCrawl ? "neutral" : percent >= target ? "success" : percent === 0 ? "danger" : "warning" }));
            },
        },
        {
            key: "modified",
            header: IndexingAuditContent.columns.modified,
            minWidth: 160,
            sortValue: (list) => list.lastItemModified,
            render: (list) => React.createElement("span", null, formatDate(list.lastItemModified)),
        },
        {
            key: "actions",
            header: IndexingAuditContent.columns.actions,
            minWidth: 120,
            render: (list) => {
                const api = SiteLists(list.siteUrl);
                const shape = { id: list.listId };
                return (React.createElement("div", { style: { display: "flex", gap: 2 } },
                    React.createElement(IconButton, { iconName: "Search", ariaLabel: `${IndexingAuditContent.actions.searchSettings}: ${list.title}`, tooltip: IndexingAuditContent.actions.searchSettings, onClick: () => window.open(api.advancedSettingsUrl(shape), "_blank", "noopener") }),
                    React.createElement(IconButton, { iconName: "Permissions", ariaLabel: `${IndexingAuditContent.actions.permissions}: ${list.title}`, tooltip: IndexingAuditContent.actions.permissions, onClick: () => window.open(api.permissionsUrl(shape), "_blank", "noopener") }),
                    React.createElement(IconButton, { iconName: "Settings", ariaLabel: `${IndexingAuditContent.actions.settings}: ${list.title}`, tooltip: IndexingAuditContent.actions.settings, onClick: () => window.open(api.settingsUrl(shape), "_blank", "noopener") })));
            },
        },
    ];
}
export function coverageBand(list, target) {
    if (list.noCrawl)
        return IndexingAuditContent.crawl.off;
    const percent = coveragePercent(list);
    if (percent === undefined)
        return "Not checked";
    if (percent === 0)
        return "Nothing indexed";
    return percent >= target ? "Meets target" : "Below target";
}
export const itemColumns = [
    {
        key: "title",
        header: IndexingAuditContent.columns.item,
        minWidth: 280,
        maxWidth: 420,
        sortValue: (item) => item.title,
        render: (item) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, item.title || "-"),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, item.url))),
    },
    {
        key: "list",
        header: IndexingAuditContent.columns.list,
        minWidth: 180,
        sortValue: (item) => item.listTitle,
        filterValue: (item) => item.listTitle,
        render: (item) => React.createElement("span", null, item.listTitle),
    },
    {
        key: "state",
        header: IndexingAuditContent.columns.state,
        minWidth: 130,
        sortValue: (item) => (!item.indexed ? 0 : item.stale ? 1 : 2),
        filterValue: (item) => stateLabel(item),
        render: (item) => (React.createElement(Badge, { label: stateLabel(item), tone: !item.indexed ? "danger" : item.stale ? "warning" : "success" })),
    },
    {
        key: "itemModified",
        header: IndexingAuditContent.columns.itemModified,
        minWidth: 160,
        sortValue: (item) => item.itemModified,
        render: (item) => React.createElement("span", null, formatDate(item.itemModified)),
    },
    {
        key: "indexedModified",
        header: IndexingAuditContent.columns.indexedModified,
        minWidth: 160,
        sortValue: (item) => { var _a; return (_a = item.indexedModified) !== null && _a !== void 0 ? _a : ""; },
        render: (item) => React.createElement("span", null, item.indexedModified ? formatDate(item.indexedModified) : "-"),
    },
];
export function stateLabel(item) {
    if (!item.indexed)
        return IndexingAuditContent.state.missing;
    return item.stale ? IndexingAuditContent.state.stale : IndexingAuditContent.state.indexed;
}
//# sourceMappingURL=IndexingAudit.columns.js.map