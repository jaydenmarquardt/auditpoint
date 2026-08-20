import * as React from "react";
import { Badge } from "../../components/feedback/Badge";
import { Theme } from "../../theme/Theme.api";
import { LinkAuditContent } from "./LinkAudit.content";
import { flagsFor, sourceLabel, statusLabel } from "./LinkAudit.logic";
import { formatNumber } from "../../utils/Format.util";
const TYPE_TONE = {
    thisSite: "info",
    otherSite: "accent",
    share: "warning",
    legacy: "danger",
    document: "accent",
    external: "warning",
    anchor: "neutral",
    contact: "success",
    script: "warning",
    unknown: "neutral",
};
const STATUS_TONE = {
    yes: "danger",
    no: "success",
    unsure: "warning",
};
const SOURCE_TONE = {
    content: "info",
    webpart: "accent",
    navigation: "neutral",
    document: "success",
    attachment: "success",
    config: "warning",
    megamenu: "neutral",
};
export const TypeTag = ({ type }) => (React.createElement(Badge, { label: LinkAuditContent.types[type], tone: TYPE_TONE[type], showIcon: false }));
export const StatusTag = ({ broken, status, matched, }) => (React.createElement("span", { style: { display: "inline-flex", gap: 4, flexWrap: "wrap" } },
    React.createElement(Badge, { label: status ? `${statusLabel(broken)} ${status}` : statusLabel(broken), tone: STATUS_TONE[broken], showIcon: false }),
    matched ? React.createElement(Badge, { label: LinkAuditContent.status.matched, tone: "info", showIcon: false }) : undefined));
/** The source and its label together, so an editor knows which control to open. */
export const SourceTag = ({ source, label }) => (React.createElement("div", { style: { minWidth: 0 } },
    React.createElement(Badge, { label: sourceLabel(source), tone: SOURCE_TONE[source], showIcon: false }),
    label ? (React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-word" } }, label)) : undefined));
/** A long url pushes every other column off the table, so it is boxed and wrapped. */
export const UrlCell = ({ url, text }) => (React.createElement("div", { style: { maxWidth: 340, minWidth: 0 } },
    text ? React.createElement("div", { style: { fontWeight: 600, wordBreak: "break-word" } }, text) : undefined,
    React.createElement("div", { style: {
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            wordBreak: "break-all",
        } }, url || "-")));
const Flags = ({ flags }) => flags.length === 0 ? (React.createElement("span", { style: { color: Theme.palette().textMuted } }, "-")) : (React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } }, flags.map((flag) => (React.createElement(Badge, { key: flag, label: flag, tone: "warning", showIcon: false })))));
export const referenceColumns = [
    {
        key: "title",
        header: LinkAuditContent.columns.title,
        minWidth: 260,
        maxWidth: 380,
        sortValue: (reference) => reference.title,
        render: (reference) => React.createElement(UrlCell, { url: reference.url, text: reference.title }),
    },
    {
        key: "list",
        header: LinkAuditContent.columns.list,
        minWidth: 160,
        sortValue: (reference) => reference.listTitle,
        filterValue: (reference) => reference.listTitle,
        render: (reference) => React.createElement("span", null, reference.listTitle),
    },
    {
        key: "kind",
        header: LinkAuditContent.columns.kind,
        minWidth: 120,
        sortValue: (reference) => reference.kind,
        filterValue: (reference) => LinkAuditContent.kinds[reference.kind],
        render: (reference) => React.createElement(Badge, { label: LinkAuditContent.kinds[reference.kind], tone: "neutral", showIcon: false }),
    },
    {
        key: "incoming",
        header: LinkAuditContent.columns.incoming,
        minWidth: 110,
        sortValue: (reference) => { var _a; return ((_a = reference.incoming) !== null && _a !== void 0 ? _a : []).length; },
        render: (reference) => { var _a; return React.createElement("span", null, formatNumber(((_a = reference.incoming) !== null && _a !== void 0 ? _a : []).length)); },
    },
    {
        key: "outgoing",
        header: LinkAuditContent.columns.outgoing,
        minWidth: 110,
        sortValue: (reference) => { var _a; return ((_a = reference.outgoing) !== null && _a !== void 0 ? _a : []).length; },
        render: (reference) => { var _a; return React.createElement("span", null, formatNumber(((_a = reference.outgoing) !== null && _a !== void 0 ? _a : []).length)); },
    },
    {
        key: "broken",
        header: LinkAuditContent.columns.broken,
        minWidth: 110,
        sortValue: (reference) => reference.brokenCount,
        render: (reference) => (React.createElement(Badge, { label: formatNumber(reference.brokenCount), tone: reference.brokenCount > 0 ? "danger" : "neutral", showIcon: false })),
    },
    {
        key: "sources",
        header: LinkAuditContent.columns.foundIn,
        minWidth: 200,
        sortValue: (reference) => sourcesOf(reference).join(", "),
        filterValue: (reference) => sourcesOf(reference).join(", ") || "-",
        render: (reference) => React.createElement("span", null, sourcesOf(reference).join(", ") || "-"),
    },
    {
        key: "flags",
        header: LinkAuditContent.columns.flags,
        minWidth: 240,
        filterValue: (reference) => { var _a; return (_a = flagsFor(reference)[0]) !== null && _a !== void 0 ? _a : "Clean"; },
        render: (reference) => React.createElement(Flags, { flags: flagsFor(reference) }),
    },
];
function sourcesOf(reference) {
    var _a;
    return [...new Set(((_a = reference.outgoing) !== null && _a !== void 0 ? _a : []).map((link) => sourceLabel(link.source)))].sort();
}
export const linkColumns = [
    {
        key: "link",
        header: LinkAuditContent.columns.link,
        minWidth: 300,
        maxWidth: 380,
        sortValue: (link) => link.key,
        render: (link) => React.createElement(UrlCell, { url: link.url, text: link.text }),
    },
    {
        key: "source",
        header: LinkAuditContent.columns.source,
        minWidth: 180,
        sortValue: (link) => link.sourceLists.join(", "),
        filterValue: (link) => { var _a; return (_a = link.sourceLists[0]) !== null && _a !== void 0 ? _a : "-"; },
        render: (link) => React.createElement("span", null, link.sourceLists.join(", ") || "-"),
    },
    {
        key: "type",
        header: LinkAuditContent.columns.type,
        minWidth: 120,
        sortValue: (link) => link.linkType,
        filterValue: (link) => LinkAuditContent.types[link.linkType],
        render: (link) => React.createElement(TypeTag, { type: link.linkType }),
    },
    {
        key: "status",
        header: LinkAuditContent.columns.status,
        minWidth: 180,
        sortValue: (link) => statusLabel(link.broken),
        filterValue: (link) => statusLabel(link.broken),
        render: (link) => React.createElement(StatusTag, { broken: link.broken, status: link.status, matched: link.targetTitle }),
    },
    {
        key: "uses",
        header: LinkAuditContent.columns.uses,
        minWidth: 90,
        sortValue: (link) => link.count,
        render: (link) => React.createElement("span", null, formatNumber(link.count)),
    },
    {
        key: "spellings",
        header: LinkAuditContent.columns.spellings,
        minWidth: 110,
        sortValue: (link) => link.variants.length,
        render: (link) => React.createElement("span", null, formatNumber(link.variants.length)),
    },
    {
        key: "resolves",
        header: LinkAuditContent.columns.resolvesTo,
        minWidth: 220,
        sortValue: (link) => link.targetTitle,
        filterValue: (link) => (link.targetTitle ? LinkAuditContent.status.matched : LinkAuditContent.status.unmapped),
        render: (link) => React.createElement("span", null, link.targetTitle || "-"),
    },
];
/** One row per place a link is written: the broken tab and the link dialog share it. */
export const usageColumns = [
    {
        key: "link",
        header: LinkAuditContent.columns.link,
        minWidth: 280,
        maxWidth: 360,
        sortValue: (usage) => usage.link.url,
        render: (usage) => React.createElement(UrlCell, { url: usage.link.url, text: usage.link.text }),
    },
    {
        key: "usedIn",
        header: LinkAuditContent.columns.usedIn,
        minWidth: 260,
        sortValue: (usage) => usage.reference.title,
        render: (usage) => React.createElement(UrlCell, { url: usage.reference.url, text: usage.reference.title }),
    },
    {
        key: "list",
        header: LinkAuditContent.columns.list,
        minWidth: 160,
        sortValue: (usage) => usage.reference.listTitle,
        filterValue: (usage) => usage.reference.listTitle,
        render: (usage) => React.createElement("span", null, usage.reference.listTitle),
    },
    {
        key: "foundIn",
        header: LinkAuditContent.columns.foundIn,
        minWidth: 200,
        sortValue: (usage) => usage.reference.source,
        filterValue: (usage) => sourceLabel(usage.reference.source),
        render: (usage) => React.createElement(SourceTag, { source: usage.reference.source, label: usage.reference.sourceLabel }),
    },
    {
        key: "type",
        header: LinkAuditContent.columns.type,
        minWidth: 120,
        sortValue: (usage) => usage.link.linkType,
        filterValue: (usage) => LinkAuditContent.types[usage.link.linkType],
        render: (usage) => React.createElement(TypeTag, { type: usage.link.linkType }),
    },
    {
        key: "status",
        header: LinkAuditContent.columns.status,
        minWidth: 160,
        sortValue: (usage) => usage.link.status,
        render: (usage) => React.createElement(StatusTag, { broken: usage.link.broken, status: usage.link.status }),
    },
];
export const outgoingColumns = [
    {
        key: "foundIn",
        header: LinkAuditContent.columns.foundIn,
        minWidth: 190,
        sortValue: (link) => link.source,
        filterValue: (link) => sourceLabel(link.source),
        render: (link) => React.createElement(SourceTag, { source: link.source, label: link.sourceLabel }),
    },
    {
        key: "link",
        header: LinkAuditContent.columns.link,
        minWidth: 300,
        maxWidth: 380,
        sortValue: (link) => link.url,
        render: (link) => React.createElement(UrlCell, { url: link.url, text: link.text }),
    },
    {
        key: "type",
        header: LinkAuditContent.columns.type,
        minWidth: 120,
        sortValue: (link) => link.linkType,
        filterValue: (link) => LinkAuditContent.types[link.linkType],
        render: (link) => React.createElement(TypeTag, { type: link.linkType }),
    },
    {
        key: "resolves",
        header: LinkAuditContent.columns.resolvesTo,
        minWidth: 200,
        sortValue: (link) => link.targetTitle,
        render: (link) => React.createElement("span", null, link.targetTitle || "-"),
    },
    {
        key: "status",
        header: LinkAuditContent.columns.status,
        minWidth: 180,
        sortValue: (link) => statusLabel(link.broken),
        filterValue: (link) => statusLabel(link.broken),
        render: (link) => React.createElement(StatusTag, { broken: link.broken, status: link.status, matched: link.targetTitle }),
    },
    {
        key: "flags",
        header: LinkAuditContent.columns.flags,
        minWidth: 200,
        render: (link) => {
            var _a;
            return (React.createElement(Flags, { flags: [
                    link.isLegacy ? LinkAuditContent.flags.legacy : "",
                    link.isInsecure ? LinkAuditContent.flags.insecure : "",
                    `${(_a = link.text) !== null && _a !== void 0 ? _a : ""}`.trim().length === 0 ? LinkAuditContent.flags.emptyText : "",
                    link.targetTitle ? "" : LinkAuditContent.flags.unmapped,
                ].filter(Boolean) }));
        },
    },
];
export const incomingColumns = [
    {
        key: "title",
        header: LinkAuditContent.columns.title,
        minWidth: 280,
        maxWidth: 380,
        sortValue: (summary) => summary.title,
        render: (summary) => React.createElement(UrlCell, { url: summary.url, text: summary.title }),
    },
    {
        key: "list",
        header: LinkAuditContent.columns.list,
        minWidth: 160,
        sortValue: (summary) => summary.listTitle,
        filterValue: (summary) => summary.listTitle,
        render: (summary) => React.createElement("span", null, summary.listTitle),
    },
    {
        key: "id",
        header: LinkAuditContent.columns.id,
        minWidth: 90,
        sortValue: (summary) => summary.itemId,
        render: (summary) => React.createElement("span", null, summary.itemId || "-"),
    },
    {
        key: "foundIn",
        header: LinkAuditContent.columns.foundIn,
        minWidth: 200,
        sortValue: (summary) => summary.source,
        filterValue: (summary) => sourceLabel(summary.source),
        render: (summary) => React.createElement(SourceTag, { source: summary.source, label: summary.sourceLabel }),
    },
];
//# sourceMappingURL=LinkAudit.columns.js.map