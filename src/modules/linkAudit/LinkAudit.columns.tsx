import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { BadgeTone, TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { BrokenState, LinkSource, LinkType } from "@/api/Links.types";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { flagsFor, sourceLabel, statusLabel } from "@/modules/linkAudit/LinkAudit.logic";
import {
  AggregatedLink,
  LinkUsage,
  OutgoingLink,
  Reference,
  ReferenceSummary,
} from "@/modules/linkAudit/LinkAudit.types";
import { formatNumber } from "@/utils/Format.util";

const TYPE_TONE: Record<LinkType, BadgeTone> = {
  thisSite: "info",
  otherSite: "accent",
  legacy: "danger",
  document: "accent",
  external: "warning",
  anchor: "neutral",
  contact: "success",
  script: "warning",
  unknown: "neutral",
};

const STATUS_TONE: Record<BrokenState, BadgeTone> = {
  yes: "danger",
  no: "success",
  unsure: "warning",
};

const SOURCE_TONE: Record<LinkSource, BadgeTone> = {
  content: "info",
  webpart: "accent",
  navigation: "neutral",
  document: "success",
  attachment: "success",
  config: "warning",
  megamenu: "neutral",
};

export const TypeTag: React.FC<{ type: LinkType }> = ({ type }) => (
  <Badge label={LinkAuditContent.types[type]} tone={TYPE_TONE[type]} showIcon={false} />
);

export const StatusTag: React.FC<{ broken: BrokenState; status?: number; matched?: string }> = ({
  broken,
  status,
  matched,
}) => (
  <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
    <Badge
      label={status ? `${statusLabel(broken)} ${status}` : statusLabel(broken)}
      tone={STATUS_TONE[broken]}
      showIcon={false}
    />
    {matched ? <Badge label={LinkAuditContent.status.matched} tone="info" showIcon={false} /> : undefined}
  </span>
);

/** The source and its label together, so an editor knows which control to open. */
export const SourceTag: React.FC<{ source: LinkSource; label?: string }> = ({ source, label }) => (
  <div style={{ minWidth: 0 }}>
    <Badge label={sourceLabel(source)} tone={SOURCE_TONE[source]} showIcon={false} />
    {label ? (
      <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-word" }}>
        {label}
      </div>
    ) : undefined}
  </div>
);

/** A long url pushes every other column off the table, so it is boxed and wrapped. */
export const UrlCell: React.FC<{ url: string; text?: string }> = ({ url, text }) => (
  <div style={{ maxWidth: 340, minWidth: 0 }}>
    {text ? <div style={{ fontWeight: 600, wordBreak: "break-word" }}>{text}</div> : undefined}
    <div
      style={{
        fontSize: Theme.tokens.font.sm,
        color: Theme.palette().textMuted,
        wordBreak: "break-all",
      }}
    >
      {url || "-"}
    </div>
  </div>
);

const Flags: React.FC<{ flags: string[] }> = ({ flags }) =>
  flags.length === 0 ? (
    <span style={{ color: Theme.palette().textMuted }}>-</span>
  ) : (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {flags.map((flag) => (
        <Badge key={flag} label={flag} tone="warning" showIcon={false} />
      ))}
    </div>
  );

export const referenceColumns: TableColumn<Reference>[] = [
  {
    key: "title",
    header: LinkAuditContent.columns.title,
    minWidth: 260,
    maxWidth: 380,
    sortValue: (reference) => reference.title,
    render: (reference) => <UrlCell url={reference.url} text={reference.title} />,
  },
  {
    key: "list",
    header: LinkAuditContent.columns.list,
    minWidth: 160,
    sortValue: (reference) => reference.listTitle,
    filterValue: (reference) => reference.listTitle,
    render: (reference) => <span>{reference.listTitle}</span>,
  },
  {
    key: "kind",
    header: LinkAuditContent.columns.kind,
    minWidth: 120,
    sortValue: (reference) => reference.kind,
    filterValue: (reference) => LinkAuditContent.kinds[reference.kind],
    render: (reference) => <Badge label={LinkAuditContent.kinds[reference.kind]} tone="neutral" showIcon={false} />,
  },
  {
    key: "incoming",
    header: LinkAuditContent.columns.incoming,
    minWidth: 110,
    sortValue: (reference) => (reference.incoming ?? []).length,
    render: (reference) => <span>{formatNumber((reference.incoming ?? []).length)}</span>,
  },
  {
    key: "outgoing",
    header: LinkAuditContent.columns.outgoing,
    minWidth: 110,
    sortValue: (reference) => (reference.outgoing ?? []).length,
    render: (reference) => <span>{formatNumber((reference.outgoing ?? []).length)}</span>,
  },
  {
    key: "broken",
    header: LinkAuditContent.columns.broken,
    minWidth: 110,
    sortValue: (reference) => reference.brokenCount,
    render: (reference) => (
      <Badge
        label={formatNumber(reference.brokenCount)}
        tone={reference.brokenCount > 0 ? "danger" : "neutral"}
        showIcon={false}
      />
    ),
  },
  {
    key: "sources",
    header: LinkAuditContent.columns.foundIn,
    minWidth: 200,
    sortValue: (reference) => sourcesOf(reference).join(", "),
    filterValue: (reference) => sourcesOf(reference).join(", ") || "-",
    render: (reference) => <span>{sourcesOf(reference).join(", ") || "-"}</span>,
  },
  {
    key: "flags",
    header: LinkAuditContent.columns.flags,
    minWidth: 240,
    filterValue: (reference) => flagsFor(reference)[0] ?? "Clean",
    render: (reference) => <Flags flags={flagsFor(reference)} />,
  },
];

function sourcesOf(reference: Reference): string[] {
  return [...new Set((reference.outgoing ?? []).map((link) => sourceLabel(link.source)))].sort();
}

export const linkColumns: TableColumn<AggregatedLink>[] = [
  {
    key: "link",
    header: LinkAuditContent.columns.link,
    minWidth: 300,
    maxWidth: 380,
    sortValue: (link) => link.key,
    render: (link) => <UrlCell url={link.url} text={link.text} />,
  },
  {
    key: "source",
    header: LinkAuditContent.columns.source,
    minWidth: 180,
    sortValue: (link) => link.sourceLists.join(", "),
    filterValue: (link) => link.sourceLists[0] ?? "-",
    render: (link) => <span>{link.sourceLists.join(", ") || "-"}</span>,
  },
  {
    key: "type",
    header: LinkAuditContent.columns.type,
    minWidth: 120,
    sortValue: (link) => link.linkType,
    filterValue: (link) => LinkAuditContent.types[link.linkType],
    render: (link) => <TypeTag type={link.linkType} />,
  },
  {
    key: "status",
    header: LinkAuditContent.columns.status,
    minWidth: 180,
    sortValue: (link) => statusLabel(link.broken),
    filterValue: (link) => statusLabel(link.broken),
    render: (link) => <StatusTag broken={link.broken} status={link.status} matched={link.targetTitle} />,
  },
  {
    key: "uses",
    header: LinkAuditContent.columns.uses,
    minWidth: 90,
    sortValue: (link) => link.count,
    render: (link) => <span>{formatNumber(link.count)}</span>,
  },
  {
    key: "spellings",
    header: LinkAuditContent.columns.spellings,
    minWidth: 110,
    sortValue: (link) => link.variants.length,
    render: (link) => <span>{formatNumber(link.variants.length)}</span>,
  },
  {
    key: "resolves",
    header: LinkAuditContent.columns.resolvesTo,
    minWidth: 220,
    sortValue: (link) => link.targetTitle,
    filterValue: (link) => (link.targetTitle ? LinkAuditContent.status.matched : LinkAuditContent.status.unmapped),
    render: (link) => <span>{link.targetTitle || "-"}</span>,
  },
];

/** One row per place a link is written: the broken tab and the link dialog share it. */
export const usageColumns: TableColumn<LinkUsage>[] = [
  {
    key: "link",
    header: LinkAuditContent.columns.link,
    minWidth: 280,
    maxWidth: 360,
    sortValue: (usage) => usage.link.url,
    render: (usage) => <UrlCell url={usage.link.url} text={usage.link.text} />,
  },
  {
    key: "usedIn",
    header: LinkAuditContent.columns.usedIn,
    minWidth: 260,
    sortValue: (usage) => usage.reference.title,
    render: (usage) => <UrlCell url={usage.reference.url} text={usage.reference.title} />,
  },
  {
    key: "list",
    header: LinkAuditContent.columns.list,
    minWidth: 160,
    sortValue: (usage) => usage.reference.listTitle,
    filterValue: (usage) => usage.reference.listTitle,
    render: (usage) => <span>{usage.reference.listTitle}</span>,
  },
  {
    key: "foundIn",
    header: LinkAuditContent.columns.foundIn,
    minWidth: 200,
    sortValue: (usage) => usage.reference.source,
    filterValue: (usage) => sourceLabel(usage.reference.source),
    render: (usage) => <SourceTag source={usage.reference.source} label={usage.reference.sourceLabel} />,
  },
  {
    key: "type",
    header: LinkAuditContent.columns.type,
    minWidth: 120,
    sortValue: (usage) => usage.link.linkType,
    filterValue: (usage) => LinkAuditContent.types[usage.link.linkType],
    render: (usage) => <TypeTag type={usage.link.linkType} />,
  },
  {
    key: "status",
    header: LinkAuditContent.columns.status,
    minWidth: 160,
    sortValue: (usage) => usage.link.status,
    render: (usage) => <StatusTag broken={usage.link.broken} status={usage.link.status} />,
  },
];

export const outgoingColumns: TableColumn<OutgoingLink>[] = [
  {
    key: "foundIn",
    header: LinkAuditContent.columns.foundIn,
    minWidth: 190,
    sortValue: (link) => link.source,
    filterValue: (link) => sourceLabel(link.source),
    render: (link) => <SourceTag source={link.source} label={link.sourceLabel} />,
  },
  {
    key: "link",
    header: LinkAuditContent.columns.link,
    minWidth: 300,
    maxWidth: 380,
    sortValue: (link) => link.url,
    render: (link) => <UrlCell url={link.url} text={link.text} />,
  },
  {
    key: "type",
    header: LinkAuditContent.columns.type,
    minWidth: 120,
    sortValue: (link) => link.linkType,
    filterValue: (link) => LinkAuditContent.types[link.linkType],
    render: (link) => <TypeTag type={link.linkType} />,
  },
  {
    key: "resolves",
    header: LinkAuditContent.columns.resolvesTo,
    minWidth: 200,
    sortValue: (link) => link.targetTitle,
    render: (link) => <span>{link.targetTitle || "-"}</span>,
  },
  {
    key: "status",
    header: LinkAuditContent.columns.status,
    minWidth: 180,
    sortValue: (link) => statusLabel(link.broken),
    filterValue: (link) => statusLabel(link.broken),
    render: (link) => <StatusTag broken={link.broken} status={link.status} matched={link.targetTitle} />,
  },
  {
    key: "flags",
    header: LinkAuditContent.columns.flags,
    minWidth: 200,
    render: (link) => (
      <Flags
        flags={[
          link.isLegacy ? LinkAuditContent.flags.legacy : "",
          link.isInsecure ? LinkAuditContent.flags.insecure : "",
          `${link.text ?? ""}`.trim().length === 0 ? LinkAuditContent.flags.emptyText : "",
          link.targetTitle ? "" : LinkAuditContent.flags.unmapped,
        ].filter(Boolean)}
      />
    ),
  },
];

export const incomingColumns: TableColumn<ReferenceSummary>[] = [
  {
    key: "title",
    header: LinkAuditContent.columns.title,
    minWidth: 280,
    maxWidth: 380,
    sortValue: (summary) => summary.title,
    render: (summary) => <UrlCell url={summary.url} text={summary.title} />,
  },
  {
    key: "list",
    header: LinkAuditContent.columns.list,
    minWidth: 160,
    sortValue: (summary) => summary.listTitle,
    filterValue: (summary) => summary.listTitle,
    render: (summary) => <span>{summary.listTitle}</span>,
  },
  {
    key: "id",
    header: LinkAuditContent.columns.id,
    minWidth: 90,
    sortValue: (summary) => summary.itemId,
    render: (summary) => <span>{summary.itemId || "-"}</span>,
  },
  {
    key: "foundIn",
    header: LinkAuditContent.columns.foundIn,
    minWidth: 200,
    sortValue: (summary) => summary.source,
    filterValue: (summary) => sourceLabel(summary.source),
    render: (summary) => <SourceTag source={summary.source} label={summary.sourceLabel} />,
  },
];
