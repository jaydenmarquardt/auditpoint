import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Button } from "../../components/actions/Button";
import { Theme } from "../../theme/Theme.api";
import { WebPartAuditContent } from "./WebPartAudit.content";
import { formatDate, formatNumber } from "../../utils/Format.util";
export function sourceLabel(isOutOfBox, isThirdParty) {
    if (isOutOfBox)
        return WebPartAuditContent.outOfBox;
    if (isThirdParty)
        return WebPartAuditContent.thirdParty;
    return WebPartAuditContent.text;
}
export function densityLabel(count) {
    if (count === 0)
        return WebPartAuditContent.density.empty;
    if (count <= 5)
        return WebPartAuditContent.density.light;
    if (count <= 15)
        return WebPartAuditContent.density.medium;
    return WebPartAuditContent.density.heavy;
}
export const typeColumns = [
    {
        key: "name",
        header: WebPartAuditContent.columns.name,
        minWidth: 240,
        maxWidth: 320,
        sortValue: (type) => type.name,
        render: (type) => (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, minWidth: 0 } },
            type.iconUrl ? (React.createElement("img", { src: type.iconUrl, alt: "", width: 16, height: 16, style: { flex: "0 0 auto" } })) : (React.createElement("i", { className: `ms-Icon ms-Icon--${type.iconName || "Puzzle"}`, "aria-hidden": "true", style: { color: Theme.palette().accent } })),
            React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, type.name),
                type.description && (React.createElement("div", { title: type.description, style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    } }, type.description))))),
    },
    {
        key: "group",
        header: WebPartAuditContent.columns.group,
        minWidth: 140,
        sortValue: (type) => type.group,
        filterValue: (type) => type.group || WebPartAuditContent.none,
        render: (type) => React.createElement("span", null, type.group || WebPartAuditContent.none),
    },
    {
        key: "source",
        header: WebPartAuditContent.columns.source,
        minWidth: 150,
        sortValue: (type) => (type.isOutOfBox ? "0" : "1"),
        filterValue: (type) => sourceLabel(type.isOutOfBox, type.isThirdParty),
        render: (type) => (React.createElement(Badge, { label: sourceLabel(type.isOutOfBox, type.isThirdParty), tone: type.isThirdParty ? "warning" : "info" })),
    },
    {
        key: "catalogue",
        header: WebPartAuditContent.columns.catalogue,
        minWidth: 130,
        sortValue: (type) => (type.inCatalogue ? 0 : 1),
        filterValue: (type) => (type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue),
        render: (type) => (React.createElement(Badge, { label: type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue, tone: type.inCatalogue ? "success" : "warning" })),
    },
    {
        key: "instances",
        header: WebPartAuditContent.columns.instances,
        minWidth: 110,
        sortValue: (type) => type.instances,
        render: (type) => React.createElement("span", null, formatNumber(type.instances)),
    },
    {
        key: "pages",
        header: WebPartAuditContent.columns.pages,
        minWidth: 100,
        sortValue: (type) => type.pages,
        render: (type) => React.createElement("span", null, formatNumber(type.pages)),
    },
    {
        key: "properties",
        header: WebPartAuditContent.columns.properties,
        minWidth: 120,
        sortValue: (type) => type.propertyKeys.length,
        render: (type) => React.createElement("span", null, formatNumber(type.propertyKeys.length)),
    },
];
export function instanceColumns(onOpenPage) {
    return [
        {
            key: "name",
            header: WebPartAuditContent.columns.name,
            minWidth: 200,
            sortValue: (instance) => instance.name,
            filterValue: (instance) => instance.name,
            render: (instance) => React.createElement("span", { style: { fontWeight: 600 } }, instance.name),
        },
        {
            key: "page",
            header: WebPartAuditContent.columns.page,
            minWidth: 260,
            maxWidth: 340,
            sortValue: (instance) => instance.pageTitle,
            filterValue: (instance) => instance.pageTitle,
            render: (instance) => (React.createElement("div", { style: { minWidth: 0 } },
                React.createElement("div", { style: { overflow: "hidden", textOverflow: "ellipsis" } }, instance.pageTitle),
                React.createElement("div", { style: {
                        fontSize: Theme.tokens.font.sm,
                        color: Theme.palette().textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    } }, instance.pageUrl))),
        },
        {
            key: "title",
            header: WebPartAuditContent.columns.title,
            minWidth: 200,
            sortValue: (instance) => instance.title,
            render: (instance) => (React.createElement("span", { style: { fontWeight: instance.title ? 600 : 400 } }, instance.title || WebPartAuditContent.none)),
        },
        {
            key: "section",
            header: WebPartAuditContent.columns.section,
            minWidth: 130,
            sortValue: (instance) => instance.section * 100 + instance.column,
            filterValue: (instance) => (instance.layer === 1 ? WebPartAuditContent.titleArea : WebPartAuditContent.body),
            render: (instance) => (React.createElement("span", null, instance.layer === 1 ? WebPartAuditContent.titleArea : `${instance.section + 1}.${instance.column + 1}`)),
        },
        {
            key: "titled",
            header: WebPartAuditContent.columns.hasTitle,
            minWidth: 120,
            sortValue: (instance) => (instance.title ? 0 : 1),
            filterValue: (instance) => (instance.title ? WebPartAuditContent.titled : WebPartAuditContent.untitled),
            render: (instance) => (React.createElement(Badge, { label: instance.title ? WebPartAuditContent.titled : WebPartAuditContent.untitled, tone: instance.title ? "success" : "neutral", showIcon: false })),
        },
        {
            key: "properties",
            header: WebPartAuditContent.columns.properties,
            minWidth: 140,
            sortValue: (instance) => instance.propertyKeys.length,
            render: (instance) => (React.createElement(Button, { label: `${instance.propertyKeys.length} ${WebPartAuditContent.viewProperties.toLowerCase()}`, variant: "subtle", onClick: () => onOpenPage(instance) })),
        },
    ];
}
export const pageColumns = [
    {
        key: "title",
        header: WebPartAuditContent.columns.page,
        minWidth: 280,
        maxWidth: 380,
        sortValue: (page) => page.title,
        render: (page) => (React.createElement("div", { style: { minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" } }, page.title),
            React.createElement("div", { style: {
                    fontSize: Theme.tokens.font.sm,
                    color: Theme.palette().textMuted,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                } }, page.url))),
    },
    {
        key: "layout",
        header: WebPartAuditContent.columns.layout,
        minWidth: 150,
        sortValue: (page) => page.pageLayout,
        filterValue: (page) => page.pageLayout || "Unknown",
        render: (page) => React.createElement(Badge, { label: page.pageLayout || "Unknown", tone: "neutral", showIcon: false }),
    },
    {
        key: "count",
        header: WebPartAuditContent.columns.count,
        minWidth: 120,
        sortValue: (page) => page.webPartCount,
        render: (page) => React.createElement("span", null, formatNumber(page.webPartCount)),
    },
    {
        key: "sections",
        header: WebPartAuditContent.columns.sections,
        minWidth: 110,
        sortValue: (page) => page.sections,
        render: (page) => React.createElement("span", null, formatNumber(page.sections)),
    },
    {
        key: "density",
        header: WebPartAuditContent.columns.density,
        minWidth: 130,
        sortValue: (page) => page.webPartCount,
        filterValue: (page) => densityLabel(page.webPartCount),
        render: (page) => React.createElement(Badge, { label: densityLabel(page.webPartCount), tone: "neutral", showIcon: false }),
    },
    {
        key: "modified",
        header: WebPartAuditContent.columns.modified,
        minWidth: 150,
        sortValue: (page) => page.modified,
        render: (page) => React.createElement("span", null, formatDate(page.modified)),
    },
];
//# sourceMappingURL=WebPartAudit.columns.js.map