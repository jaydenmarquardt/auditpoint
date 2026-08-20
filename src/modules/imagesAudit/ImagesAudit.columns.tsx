import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { ImageUsage } from "@/api/Images.types";
import { ImagesAuditContent } from "@/modules/imagesAudit/ImagesAudit.content";
import { flagsFor } from "@/modules/imagesAudit/ImagesAudit.logic";
import { ImageFileView } from "@/modules/imagesAudit/ImagesAudit.types";
import { formatBytes, formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export const fileColumns: TableColumn<ImageFileView>[] = [
  {
    key: "name",
    header: ImagesAuditContent.columns.name,
    minWidth: 280,
    maxWidth: 380,
    sortValue: (file) => file.name,
    render: (file) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.url}
        </div>
      </div>
    ),
  },
  {
    key: "list",
    header: ImagesAuditContent.columns.list,
    minWidth: 180,
    sortValue: (file) => file.listTitle,
    filterValue: (file) => file.listTitle,
    render: (file) => <span>{file.listTitle}</span>,
  },
  {
    key: "format",
    header: ImagesAuditContent.columns.format,
    minWidth: 120,
    sortValue: (file) => file.extension,
    filterValue: (file) => file.extension || "unknown",
    render: (file) => <Badge label={file.extension || "unknown"} tone="neutral" showIcon={false} />,
  },
  {
    key: "size",
    header: ImagesAuditContent.columns.size,
    minWidth: 120,
    sortValue: (file) => file.sizeBytes,
    render: (file) => <span>{formatBytes(file.sizeBytes)}</span>,
  },
  {
    key: "uses",
    header: ImagesAuditContent.columns.uses,
    minWidth: 100,
    sortValue: (file) => file.useCount,
    render: (file) => (
      <Badge label={formatNumber(file.useCount)} tone={file.useCount === 0 ? "warning" : "neutral"} showIcon={false} />
    ),
  },
  {
    key: "modified",
    header: ImagesAuditContent.columns.modified,
    minWidth: 150,
    sortValue: (file) => file.modified,
    render: (file) => <span>{file.modified ? formatDate(file.modified) : "-"}</span>,
  },
  {
    key: "flags",
    header: ImagesAuditContent.columns.flags,
    minWidth: 240,
    filterValue: (file) => flagsFor(file)[0] ?? "Clean",
    render: (file) => {
      const flags = flagsFor(file);

      return flags.length === 0 ? (
        <span style={{ color: Theme.palette().textMuted }}>-</span>
      ) : (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {flags.map((flag) => (
            <Badge key={flag} label={flag} tone="warning" showIcon={false} />
          ))}
        </div>
      );
    },
  },
  {
    key: "actions",
    header: ImagesAuditContent.columns.actions,
    minWidth: 110,
    render: (file) => (
      <Button
        label={ImagesAuditContent.open}
        variant="subtle"
        iconName="OpenInNewWindow"
        href={absoluteFromServerRelative(file.url, file.siteUrl || window.location.href)}
      />
    ),
  },
];

export const usageColumns: TableColumn<ImageUsage>[] = [
  {
    key: "title",
    header: ImagesAuditContent.columns.page,
    minWidth: 260,
    maxWidth: 360,
    sortValue: (usage) => usage.title,
    filterValue: (usage) => usage.title,
    render: (usage) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{usage.title}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {usage.pageUrl}
        </div>
      </div>
    ),
  },
  {
    key: "list",
    header: ImagesAuditContent.columns.list,
    minWidth: 170,
    sortValue: (usage) => usage.listTitle,
    filterValue: (usage) => usage.listTitle,
    render: (usage) => <span>{usage.listTitle}</span>,
  },
  {
    key: "src",
    header: ImagesAuditContent.columns.src,
    minWidth: 300,
    maxWidth: 420,
    sortValue: (usage) => usage.src,
    render: (usage) => (
      <span style={{ wordBreak: "break-all", fontSize: Theme.tokens.font.sm }}>{usage.src || "-"}</span>
    ),
  },
  {
    key: "alt",
    header: ImagesAuditContent.columns.alt,
    minWidth: 220,
    sortValue: (usage) => usage.alt,
    filterValue: (usage) => (usage.hasAlt ? ImagesAuditContent.withAlt : ImagesAuditContent.withoutAlt),
    render: (usage) =>
      usage.hasAlt ? (
        <span>{usage.alt}</span>
      ) : (
        <Badge label={ImagesAuditContent.flags.missingAlt} tone="danger" showIcon={false} />
      ),
  },
  {
    key: "dimensions",
    header: ImagesAuditContent.columns.dimensions,
    minWidth: 150,
    sortValue: (usage) => `${usage.width}x${usage.height}`,
    render: (usage) => <span>{usage.width || usage.height ? `${usage.width || "?"} x ${usage.height || "?"}` : "-"}</span>,
  },
  {
    key: "external",
    header: ImagesAuditContent.columns.flags,
    minWidth: 160,
    filterValue: (usage) => (usage.isExternal ? ImagesAuditContent.flags.external : "Same tenant"),
    render: (usage) =>
      usage.isExternal ? (
        <Badge label={ImagesAuditContent.flags.external} tone="warning" showIcon={false} />
      ) : (
        <span style={{ color: Theme.palette().textMuted }}>-</span>
      ),
  },
];
