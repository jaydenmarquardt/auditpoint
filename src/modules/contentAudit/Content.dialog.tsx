import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { StatGrid } from "@/components/layout/StatGrid";
import { Theme } from "@/theme/Theme.api";
import { ContentAuditContent } from "@/modules/contentAudit/ContentAudit.content";
import { issuesFor } from "@/modules/contentAudit/ContentAudit.logic";
import { ContentEntry } from "@/modules/contentAudit/ContentAudit.types";
import { formatDate, formatDuration, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export interface ContentDialogProps {
  entry?: ContentEntry;
  thinWordCount: number;
  onDismiss: () => void;
}

export const ContentDialog: React.FC<ContentDialogProps> = ({ entry, thinWordCount, onDismiss }) => {
  if (!entry) return null;

  const issues = issuesFor(entry, thinWordCount);
  const headings = Object.entries(entry.headingsByLevel ?? {}).filter(([, count]) => count > 0);

  return (
    <PreviewDialog
      open={Boolean(entry)}
      onDismiss={onDismiss}
      title={entry.title || entry.url}
      description={entry.url}
      facts={[
        { label: ContentAuditContent.columns.source, value: ContentAuditContent.sources[entry.source] },
        { label: ContentAuditContent.columns.list, value: entry.listTitle },
        { label: ContentAuditContent.columns.column, value: <code>{entry.column}</code> },
        { label: "Content type", value: entry.contentType || "-" },
        { label: ContentAuditContent.columns.modified, value: entry.modified ? formatDate(entry.modified) : "-" },
        {
          label: ContentAuditContent.columns.issues,
          value:
            issues.length === 0 ? (
              <span style={{ color: Theme.palette().textMuted }}>-</span>
            ) : (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {issues.map((issue) => (
                  <Badge key={issue} label={issue} tone="warning" showIcon={false} />
                ))}
              </div>
            ),
        },
      ]}
      actions={
        <>
          {entry.url && (
            <Button
              label={ContentAuditContent.open}
              iconName="OpenInNewWindow"
              href={absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href)}
            />
          )}
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[
        {
          key: "metrics",
          title: ContentAuditContent.dialog.metrics,
          content: (
            <StatGrid
              columns={4}
              tiles={[
                { key: "words", label: ContentAuditContent.columns.words, value: formatNumber(entry.words) },
                { key: "characters", label: "Characters", value: formatNumber(entry.characters) },
                { key: "paragraphs", label: "Paragraphs", value: formatNumber(entry.paragraphs) },
                {
                  key: "reading",
                  label: ContentAuditContent.columns.reading,
                  value: formatDuration(entry.readingMinutes * 60 * 1000),
                },
                { key: "headings", label: ContentAuditContent.columns.headings, value: formatNumber(entry.headings) },
                { key: "images", label: ContentAuditContent.columns.images, value: formatNumber(entry.images) },
                { key: "links", label: ContentAuditContent.columns.links, value: formatNumber(entry.links) },
                { key: "external", label: "External links", value: formatNumber(entry.externalLinks) },
                { key: "empty", label: "Empty links", value: formatNumber(entry.emptyLinks) },
                { key: "tables", label: ContentAuditContent.columns.tables, value: formatNumber(entry.tables) },
                { key: "lists", label: "List blocks", value: formatNumber(entry.listBlocks) },
                { key: "embeds", label: "Embeds", value: formatNumber(entry.embeds) },
              ]}
            />
          ),
        },
        {
          key: "headings",
          title: ContentAuditContent.dialog.headings,
          content:
            headings.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{ContentAuditContent.dialog.noHeadings}</p>
            ) : (
              <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" }}>
                {headings.map(([level, count]) => (
                  <Badge key={level} label={`${level.toUpperCase()}: ${count}`} tone="info" showIcon={false} />
                ))}
              </div>
            ),
        },
      ]}
    />
  );
};
