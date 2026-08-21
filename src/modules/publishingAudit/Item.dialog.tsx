import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Spinner } from "@/components/feedback/Spinner";
import { Theme } from "@/theme/Theme.api";
import { Publishing } from "@/api/Publishing.api";
import { PublishingItem } from "@/api/Publishing.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import {
  daysSinceEdit,
  expiryDate,
  reviewDate,
  statusLabel,
} from "@/modules/publishingAudit/PublishingAudit.logic";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";
import { toErrorMessage } from "@/utils/Guard.util";

export interface ItemDialogProps {
  item?: PublishingItem;
  versionDepth: number;
  onLoaded: (item: PublishingItem, count: number, editors: string[]) => void;
  onDismiss: () => void;
}

export const ItemDialog: React.FC<ItemDialogProps> = ({ item, versionDepth, onLoaded, onDismiss }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const loadVersions = (): void => {
    if (!item) return;

    setLoading(true);
    setError(undefined);

    Publishing(item.siteUrl)
      .versions({ id: item.listId, title: item.listTitle } as never, item.itemId, versionDepth)
      .then((history) => onLoaded(item, history.count, history.editors))
      .catch((thrown: unknown) => setError(toErrorMessage(thrown)))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  if (!item) return null;

  return (
    <PreviewDialog
      open={Boolean(item)}
      onDismiss={onDismiss}
      title={item.title}
      description={item.url}
      facts={[
        { label: PublishingAuditContent.columns.list, value: item.listTitle },
        {
          label: PublishingAuditContent.columns.status,
          value: <Badge label={statusLabel(item.moderationStatus)} tone="neutral" showIcon={false} />,
        },
        { label: PublishingAuditContent.columns.author, value: item.authorTitle || "-" },
        { label: PublishingAuditContent.columns.created, value: item.created ? formatDate(item.created) : "-" },
        { label: PublishingAuditContent.columns.editor, value: item.editorTitle || "-" },
        { label: PublishingAuditContent.columns.modified, value: item.modified ? formatDate(item.modified) : "-" },
        { label: PublishingAuditContent.columns.age, value: `${formatNumber(daysSinceEdit(item))}d` },
        { label: PublishingAuditContent.columns.version, value: item.versionLabel || "-" },
        { label: PublishingAuditContent.columns.review, value: reviewDate(item) ? formatDate(reviewDate(item)!) : "-" },
        { label: PublishingAuditContent.columns.expiry, value: expiryDate(item) ? formatDate(expiryDate(item)!) : "-" },
        
      ]}
      actions={
        <>
          {item.url && (
            <Button
              label={PublishingAuditContent.open}
              iconName="OpenInNewWindow"
              href={absoluteFromServerRelative(item.url, item.siteUrl || window.location.href)}
            />
          )}
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[
        {
          key: "dates",
          title: PublishingAuditContent.dialog.dates,
          content:
            Object.keys(item.dates).length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{PublishingAuditContent.dialog.noDates}</p>
            ) : (
              <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" }}>
                {Object.entries(item.dates).map(([column, value]) => (
                  <Badge key={column} label={`${column}: ${formatDate(value)}`} tone="neutral" showIcon={false} />
                ))}
              </div>
            ),
        },
        {
          key: "versions",
          title: PublishingAuditContent.dialog.versions,
          content: loading ? (
            <Spinner label={PublishingAuditContent.dialog.versions} />
          ) : (
            <div style={{ display: "grid", gap: Theme.tokens.space.sm }}>
              {error && <p style={{ margin: 0, color: Theme.tone("danger").fg }}>{error}</p>}

              {item.versionCount === undefined ? (
                <div>
                  <Button
                    label={PublishingAuditContent.dialog.loadVersions}
                    iconName="History"
                    onClick={loadVersions}
                  />
                </div>
              ) : (
                <>
                  <p style={{ margin: 0 }}>
                    {formatNumber(item.versionCount)} {PublishingAuditContent.dialog.versionsRead}
                  </p>
                  <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" }}>
                    {(item.versionEditors ?? []).map((editor) => (
                      <Badge key={editor} label={editor} tone="info" showIcon={false} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ),
        },
      ]}
    />
  );
};
