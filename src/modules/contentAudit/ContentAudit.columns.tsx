import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { issuesFor } from "@/modules/contentAudit/ContentAudit.logic";
import { ContentEntry } from "@/modules/contentAudit/ContentAudit.types";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export function entryColumns(thinWordCount: number): TableColumn<ContentEntry>[] {
  return [
    {
      key: "title",
      header: ContentAuditContent.columns.title,
      minWidth: 280,
      maxWidth: 380,
      sortValue: (entry) => entry.title,
      render: (entry) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{entry.title || "-"}</div>
          <div
            style={{
              fontSize: Theme.tokens.font.sm,
              color: Theme.palette().textMuted,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {entry.url}
          </div>
        </div>
      ),
    },
    {
      key: "source",
      header: ContentAuditContent.columns.source,
      minWidth: 130,
      sortValue: (entry) => entry.source,
      filterValue: (entry) => ContentAuditContent.sources[entry.source],
      render: (entry) => <Badge label={ContentAuditContent.sources[entry.source]} tone="neutral" showIcon={false} />,
    },
    {
      key: "list",
      header: ContentAuditContent.columns.list,
      minWidth: 180,
      sortValue: (entry) => entry.listTitle,
      filterValue: (entry) => entry.listTitle,
      render: (entry) => <span>{entry.listTitle}</span>,
    },
    {
      key: "column",
      header: ContentAuditContent.columns.column,
      minWidth: 150,
      sortValue: (entry) => entry.column,
      filterValue: (entry) => entry.column,
      render: (entry) => <code style={{ fontSize: Theme.tokens.font.sm }}>{entry.column}</code>,
    },
    {
      key: "words",
      header: ContentAuditContent.columns.words,
      minWidth: 110,
      sortValue: (entry) => entry.words,
      render: (entry) => <span>{formatNumber(entry.words)}</span>,
    },
    {
      key: "headings",
      header: ContentAuditContent.columns.headings,
      minWidth: 120,
      sortValue: (entry) => entry.headings,
      render: (entry) => <span>{formatNumber(entry.headings)}</span>,
    },
    {
      key: "images",
      header: ContentAuditContent.columns.images,
      minWidth: 110,
      sortValue: (entry) => entry.images,
      render: (entry) => <span>{formatNumber(entry.images)}</span>,
    },
    {
      key: "links",
      header: ContentAuditContent.columns.links,
      minWidth: 110,
      sortValue: (entry) => entry.links,
      render: (entry) => <span>{formatNumber(entry.links)}</span>,
    },
    {
      key: "modified",
      header: ContentAuditContent.columns.modified,
      minWidth: 150,
      sortValue: (entry) => entry.modified,
      render: (entry) => <span>{entry.modified ? formatDate(entry.modified) : "-"}</span>,
    },
    {
      key: "issues",
      header: ContentAuditContent.columns.issues,
      minWidth: 240,
      filterValue: (entry) => issuesFor(entry, thinWordCount)[0] ?? ContentAuditContent.issues.none,
      render: (entry) => {
        const issues = issuesFor(entry, thinWordCount);

        return issues.length === 0 ? (
          <span style={{ color: Theme.palette().textMuted }}>-</span>
        ) : (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {issues.map((issue) => (
              <Badge key={issue} label={issue} tone="warning" showIcon={false} />
            ))}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: ContentAuditContent.columns.actions,
      minWidth: 110,
      render: (entry) =>
        entry.url ? (
          <Button
            label={ContentAuditContent.open}
            variant="subtle"
            iconName="OpenInNewWindow"
            href={absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href)}
          />
        ) : (
          <span style={{ color: Theme.palette().textMuted }}>-</span>
        ),
    },
  ];
}
