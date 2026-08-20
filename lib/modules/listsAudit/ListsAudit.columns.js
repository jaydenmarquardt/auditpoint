import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { IconButton } from "../../components/actions/IconButton";
import { Theme } from "../../theme/Theme.api";
import { SiteLists } from "../../api/Lists.api";
import { ListsAuditContent } from "./ListsAudit.content";
import { daysSince } from "./ListsAudit.logic";
import { formatBytes, formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export function listColumns(onSelect) {
    return [
        {
            key: "title",
            header: ListsAuditContent.columns.title,
            minWidth: 220,
            maxWidth: 320,
            sortValue: (list) => list.title,
            render: (list) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, list.title),
                React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, list.serverRelativeUrl))),
        },
        {
            key: "template",
            header: ListsAuditContent.columns.template,
            minWidth: 150,
            sortValue: (list) => list.templateName,
            filterValue: (list) => list.templateName,
            render: (list) => (React.createElement(Badge, { label: list.templateName, tone: list.kind === "library" ? "info" : "neutral", showIcon: false })),
        },
        {
            key: "visibility",
            header: ListsAuditContent.columns.visibility,
            minWidth: 120,
            sortValue: (list) => (list.hidden ? 1 : 0),
            filterValue: (list) => (list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible),
            render: (list) => (React.createElement(Badge, { label: list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible, tone: list.hidden ? "warning" : "neutral" })),
        },
        {
            key: "items",
            header: ListsAuditContent.columns.items,
            minWidth: 100,
            sortValue: (list) => list.itemCount,
            render: (list) => React.createElement("span", null, formatNumber(list.itemCount)),
        },
        {
            key: "folders",
            header: ListsAuditContent.columns.folders,
            minWidth: 100,
            sortValue: (list) => { var _a; return (_a = list.folderCount) !== null && _a !== void 0 ? _a : -1; },
            render: (list) => React.createElement("span", null, list.folderCount === undefined ? "-" : formatNumber(list.folderCount)),
        },
        {
            key: "files",
            header: ListsAuditContent.columns.files,
            minWidth: 100,
            sortValue: (list) => { var _a; return (_a = list.fileCount) !== null && _a !== void 0 ? _a : -1; },
            render: (list) => React.createElement("span", null, list.fileCount === undefined ? "-" : formatNumber(list.fileCount)),
        },
        {
            key: "storage",
            header: ListsAuditContent.columns.storage,
            minWidth: 110,
            sortValue: (list) => { var _a; return (_a = list.storageBytes) !== null && _a !== void 0 ? _a : -1; },
            render: (list) => React.createElement("span", null, list.storageBytes === undefined ? "-" : formatBytes(list.storageBytes)),
        },
        {
            key: "contentTypes",
            header: ListsAuditContent.columns.contentTypes,
            minWidth: 180,
            maxWidth: 260,
            sortValue: (list) => { var _a; return ((_a = list.contentTypes) !== null && _a !== void 0 ? _a : []).length; },
            render: (list) => {
                var _a;
                return (React.createElement("span", { style: { color: Theme.palette().textMuted } }, ((_a = list.contentTypes) !== null && _a !== void 0 ? _a : []).join(", ") || "-"));
            },
        },
        {
            key: "modified",
            header: ListsAuditContent.columns.modified,
            minWidth: 170,
            sortValue: (list) => list.lastItemModified,
            render: (list) => (React.createElement("span", null,
                formatDate(list.lastItemModified),
                React.createElement("span", { style: { color: Theme.palette().textMuted } },
                    " \u00B7 ",
                    daysSince(list.lastItemModified),
                    "d"))),
        },
        {
            key: "versioning",
            header: ListsAuditContent.columns.versioning,
            minWidth: 120,
            sortValue: (list) => (list.versioningEnabled ? 1 : 0),
            filterValue: (list) => (list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off),
            render: (list) => (React.createElement(Badge, { label: list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off, tone: list.versioningEnabled ? "success" : "warning" })),
        },
        {
            key: "permissions",
            header: ListsAuditContent.columns.permissions,
            minWidth: 130,
            sortValue: (list) => (list.hasUniquePermissions ? 1 : 0),
            filterValue: (list) => (list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited),
            render: (list) => (React.createElement(Badge, { label: list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited, tone: list.hasUniquePermissions ? "warning" : "neutral" })),
        },
        {
            key: "actions",
            header: ListsAuditContent.columns.actions,
            minWidth: 130,
            render: (list) => (React.createElement("div", { style: { display: "flex", gap: 2 } },
                React.createElement(IconButton, { iconName: "Info", ariaLabel: `${ListsAuditContent.details}: ${list.title}`, tooltip: ListsAuditContent.details, onClick: () => onSelect(list) }),
                React.createElement(IconButton, { iconName: "Settings", ariaLabel: `${ListsAuditContent.openSettings}: ${list.title}`, tooltip: ListsAuditContent.openSettings, onClick: () => window.open(SiteLists(list.siteUrl).settingsUrl(list), "_blank", "noopener") }),
                React.createElement(IconButton, { iconName: "OpenInNewWindow", ariaLabel: `${ListsAuditContent.openList}: ${list.title}`, tooltip: ListsAuditContent.openList, onClick: () => {
                        var _a, _b;
                        return window.open(list.defaultViewUrl
                            ? absoluteFromServerRelative(list.defaultViewUrl, (_a = list.siteUrl) !== null && _a !== void 0 ? _a : window.location.href)
                            : (_b = list.siteUrl) !== null && _b !== void 0 ? _b : "", "_blank", "noopener");
                    } }))),
        },
    ];
}
//# sourceMappingURL=ListsAudit.columns.js.map