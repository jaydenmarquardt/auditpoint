import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { PublishingItem } from "@/api/Publishing.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { daysSinceEdit, expiryDate, reviewDate, statusLabel } from "@/modules/publishingAudit/PublishingAudit.logic";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

const titleColumn: TableColumn<PublishingItem> = {
  key: "title",
  header: PublishingAuditContent.columns.title,
  minWidth: 280,
  maxWidth: 380,
  sortValue: (item) => item.title,
  render: (item) => (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
      <div
        style={{
          fontSize: Theme.tokens.font.sm,
          color: Theme.palette().textMuted,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.url}
      </div>
    </div>
  ),
};

const actionsColumn: TableColumn<PublishingItem> = {
  key: "actions",
  header: PublishingAuditContent.columns.actions,
  minWidth: 110,
  render: (item) =>
    item.url ? (
      <Button
        label={PublishingAuditContent.open}
        variant="subtle"
        iconName="OpenInNewWindow"
        href={absoluteFromServerRelative(item.url, item.siteUrl || window.location.href)}
      />
    ) : (
      <span style={{ color: Theme.palette().textMuted }}>-</span>
    ),
};

export const itemColumns: TableColumn<PublishingItem>[] = [
  titleColumn,
  {
    key: "list",
    header: PublishingAuditContent.columns.list,
    minWidth: 180,
    sortValue: (item) => item.listTitle,
    filterValue: (item) => item.listTitle,
    render: (item) => <span>{item.listTitle}</span>,
  },
  {
    key: "status",
    header: PublishingAuditContent.columns.status,
    minWidth: 140,
    sortValue: (item) => statusLabel(item.moderationStatus),
    filterValue: (item) => statusLabel(item.moderationStatus),
    render: (item) => (
      <Badge
        label={statusLabel(item.moderationStatus)}
        tone={item.moderationStatus === 2 || item.moderationStatus === 3 ? "warning" : item.moderationStatus === 1 ? "danger" : "neutral"}
        showIcon={false}
      />
    ),
  },
  {
    key: "editor",
    header: PublishingAuditContent.columns.editor,
    minWidth: 180,
    sortValue: (item) => item.editorTitle,
    filterValue: (item) => item.editorTitle || "-",
    render: (item) => <span>{item.editorTitle || "-"}</span>,
  },
  {
    key: "modified",
    header: PublishingAuditContent.columns.modified,
    minWidth: 150,
    sortValue: (item) => item.modified,
    render: (item) => <span>{item.modified ? formatDate(item.modified) : "-"}</span>,
  },
  {
    key: "age",
    header: PublishingAuditContent.columns.age,
    minWidth: 130,
    sortValue: (item) => daysSinceEdit(item),
    render: (item) => <span>{item.modified ? `${formatNumber(daysSinceEdit(item))}d` : "-"}</span>,
  },
  {
    key: "version",
    header: PublishingAuditContent.columns.version,
    minWidth: 110,
    sortValue: (item) => item.versionLabel,
    render: (item) => <span>{item.versionLabel || "-"}</span>,
  },
  {
    key: "versions",
    header: PublishingAuditContent.columns.versions,
    minWidth: 120,
    sortValue: (item) => item.versionCount ?? -1,
    render: (item) => <span>{item.versionCount === undefined ? "-" : formatNumber(item.versionCount)}</span>,
  },
  
  actionsColumn,
];

export const reviewColumns: TableColumn<PublishingItem>[] = [
  titleColumn,
  {
    key: "list",
    header: PublishingAuditContent.columns.list,
    minWidth: 180,
    sortValue: (item) => item.listTitle,
    filterValue: (item) => item.listTitle,
    render: (item) => <span>{item.listTitle}</span>,
  },
  {
    key: "review",
    header: PublishingAuditContent.columns.review,
    minWidth: 160,
    sortValue: (item) => reviewDate(item) ?? "",
    render: (item) => <DateCell iso={reviewDate(item)} />,
  },
  {
    key: "expiry",
    header: PublishingAuditContent.columns.expiry,
    minWidth: 160,
    sortValue: (item) => expiryDate(item) ?? "",
    render: (item) => <DateCell iso={expiryDate(item)} />,
  },
  {
    key: "modified",
    header: PublishingAuditContent.columns.modified,
    minWidth: 150,
    sortValue: (item) => item.modified,
    render: (item) => <span>{item.modified ? formatDate(item.modified) : "-"}</span>,
  },
  actionsColumn,
];

const DateCell: React.FC<{ iso?: string }> = ({ iso }) => {
  if (!iso) return <span style={{ color: Theme.palette().textMuted }}>-</span>;

  const past = new Date(iso).getTime() < Date.now();
  return <Badge label={formatDate(iso)} tone={past ? "danger" : "neutral"} showIcon={false} />;
};
