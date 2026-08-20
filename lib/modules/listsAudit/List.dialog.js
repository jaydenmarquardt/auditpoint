import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Badge } from "../../components/feedback/Badge";
import { StatTile } from "../../components/layout/StatTile";
import { Tabs } from "../../components/data/Tabs";
import { ChartCard } from "../../components/charts/ChartCard";
import { EmptyState } from "../../components/states/Empty.state";
import { Theme } from "../../theme/Theme.api";
import { SiteLists } from "../../api/Lists.api";
import { ListsAuditContent } from "./ListsAudit.content";
import { daysSince, extensionLabel } from "./ListsAudit.logic";
import { ContentTypesCard } from "./cards/ContentTypes.ocard";
import { formatBytes, formatDate, formatNumber } from "../../utils/Format.util";
import { absoluteFromServerRelative } from "../../utils/Url.util";
export const ListDialog = ({ list, onDismiss }) => {
    var _a, _b, _c, _d;
    const [tab, setTab] = React.useState("summary");
    if (!list)
        return null;
    const site = (_a = list.siteUrl) !== null && _a !== void 0 ? _a : window.location.origin;
    const isLibrary = list.kind === "library";
    const extensions = Object.entries((_b = list.extensions) !== null && _b !== void 0 ? _b : {})
        .map(([extension, stat]) => ({ label: extensionLabel(extension), count: stat.count, bytes: stat.bytes }))
        .sort((a, b) => b.count - a.count);
    const averageFileBytes = list.fileCount && list.storageBytes ? Math.round(list.storageBytes / list.fileCount) : undefined;
    return (React.createElement(PreviewDialog, { open: Boolean(list), onDismiss: onDismiss, title: list.title, description: list.description || list.serverRelativeUrl, actions: React.createElement(React.Fragment, null,
            React.createElement(Button, { label: ListsAuditContent.openSettings, iconName: "Settings", onClick: () => window.open(SiteLists(list.siteUrl).settingsUrl(list), "_blank", "noopener") }),
            React.createElement(Button, { label: ListsAuditContent.openList, iconName: "OpenInNewWindow", onClick: () => window.open(list.defaultViewUrl ? absoluteFromServerRelative(list.defaultViewUrl, site) : site, "_blank", "noopener") }),
            React.createElement(Button, { label: ListsAuditContent.dialog.close, variant: "primary", onClick: onDismiss })) },
        React.createElement(Tabs, { ariaLabel: list.title, selectedKey: tab, onChange: setTab, items: [
                {
                    key: "summary",
                    label: ListsAuditContent.dialog.tabSummary,
                    content: (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.lg } },
                        React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" } },
                            React.createElement(StatTile, { label: ListsAuditContent.columns.items, value: formatNumber(list.itemCount) }),
                            React.createElement(StatTile, { label: ListsAuditContent.columns.folders, value: list.folderCount === undefined ? "-" : formatNumber(list.folderCount) }),
                            React.createElement(StatTile, { label: ListsAuditContent.columns.files, value: isLibrary && list.fileCount !== undefined ? formatNumber(list.fileCount) : "-" }),
                            React.createElement(StatTile, { label: ListsAuditContent.stats.storage, value: isLibrary && list.storageBytes !== undefined ? formatBytes(list.storageBytes) : "-", hint: averageFileBytes && isLibrary
                                    ? `${formatBytes(averageFileBytes)} ${ListsAuditContent.dialog.perFile}`
                                    : undefined }),
                            React.createElement(StatTile, { label: ListsAuditContent.columns.modified, value: formatDate(list.lastItemModified), hint: `${daysSince(list.lastItemModified)} ${ListsAuditContent.dialog.daysAgo}` }),
                            React.createElement(StatTile, { label: ListsAuditContent.columns.contentTypes, value: formatNumber(((_c = list.contentTypes) !== null && _c !== void 0 ? _c : []).length) })),
                        React.createElement("div", { style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                                gap: Theme.tokens.space.md,
                            } },
                            React.createElement(ContentTypesCard, { contentTypes: (_d = list.contentTypes) !== null && _d !== void 0 ? _d : [], itemCount: list.itemCount })))),
                },
                {
                    key: "configuration",
                    label: ListsAuditContent.dialog.tabConfiguration,
                    content: (React.createElement("dl", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                            gap: Theme.tokens.space.md,
                            margin: 0,
                        } },
                        React.createElement(Fact, { label: ListsAuditContent.columns.template, value: list.templateName }),
                        React.createElement(Fact, { label: ListsAuditContent.dialog.created, value: formatDate(list.created) }),
                        React.createElement(Fact, { label: ListsAuditContent.columns.versioning, value: React.createElement(Badge, { label: list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off, tone: list.versioningEnabled ? "success" : "warning" }) }),
                        React.createElement(Fact, { label: ListsAuditContent.dialog.versionLimit, value: list.majorVersionLimit ? formatNumber(list.majorVersionLimit) : ListsAuditContent.dialog.unlimited }),
                        React.createElement(Fact, { label: ListsAuditContent.columns.permissions, value: React.createElement(Badge, { label: list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited, tone: list.hasUniquePermissions ? "warning" : "neutral" }) }),
                        React.createElement(Fact, { label: ListsAuditContent.columns.visibility, value: React.createElement(Badge, { label: list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible, tone: list.hidden ? "warning" : "neutral" }) }),
                        React.createElement(Fact, { label: ListsAuditContent.dialog.contentTypesOn, value: list.contentTypesEnabled ? ListsAuditContent.on : ListsAuditContent.off }),
                        React.createElement(Fact, { label: ListsAuditContent.dialog.scanTitle, value: list.scannedItems === undefined
                                ? ListsAuditContent.dialog.notScanned
                                : `${formatNumber(list.scannedItems)} ${ListsAuditContent.dialog.itemsScanned}${list.scanTruncated ? ` ${ListsAuditContent.dialog.capped}` : ""}` }),
                        React.createElement(Fact, { label: ListsAuditContent.dialog.url, value: React.createElement("code", null, list.serverRelativeUrl) }))),
                },
                {
                    key: "files",
                    label: ListsAuditContent.dialog.tabFiles,
                    content: !isLibrary ? (React.createElement(EmptyState, { title: ListsAuditContent.dialog.filesOnlyTitle, description: ListsAuditContent.dialog.filesOnly, iconName: "Page" })) : (React.createElement("div", { style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                            gap: Theme.tokens.space.md,
                        } },
                        React.createElement(ChartCard, { title: ListsAuditContent.charts.extensions, info: ListsAuditContent.cardInfo.extensions, points: extensions.map((entry) => ({ label: entry.label, value: entry.count })), charts: ["hbar", "donut"], emptyLabel: ListsAuditContent.dialog.noFiles }),
                        React.createElement(ChartCard, { title: ListsAuditContent.charts.extensionSize, info: ListsAuditContent.cardInfo.extensionSize, defaultChart: "donut", charts: ["donut", "hbar"], valueFormatter: formatBytes, points: extensions.map((entry) => ({ label: entry.label, value: entry.bytes })), emptyLabel: ListsAuditContent.dialog.noFiles }))),
                },
            ] })));
};
const Fact = ({ label, value }) => (React.createElement("div", { style: { minWidth: 0 } },
    React.createElement("dt", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, label),
    React.createElement("dd", { style: { margin: "2px 0 0", fontWeight: 600, wordBreak: "break-word" } }, value)));
//# sourceMappingURL=List.dialog.js.map