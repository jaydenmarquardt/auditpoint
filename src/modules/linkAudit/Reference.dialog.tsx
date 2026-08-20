import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Table } from "@/components/data/Table";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { flagsFor } from "@/modules/linkAudit/LinkAudit.logic";
import { incomingColumns, outgoingColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { exportReferenceLinks } from "@/modules/linkAudit/LinkAudit.csv";
import { Reference } from "@/modules/linkAudit/LinkAudit.types";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export interface ReferenceDialogProps {
  reference?: Reference;
  onDismiss: () => void;
}

export const ReferenceDialog: React.FC<ReferenceDialogProps> = ({ reference, onDismiss }) => {
  if (!reference) return null;

  const outgoing = reference.outgoing ?? [];
  const incoming = reference.incoming ?? [];
  const broken = outgoing.filter((link) => link.broken === "yes");
  const flags = flagsFor(reference);

  return (
    <PreviewDialog
      open={Boolean(reference)}
      onDismiss={onDismiss}
      width="full"
      title={reference.title || reference.url}
      description={reference.url}
      facts={[
        { label: LinkAuditContent.columns.kind, value: LinkAuditContent.kinds[reference.kind] },
        { label: LinkAuditContent.columns.list, value: reference.listTitle },
        { label: LinkAuditContent.columns.id, value: reference.itemId || "-" },
        { label: LinkAuditContent.columns.modified, value: reference.modified ? formatDate(reference.modified) : "-" },
        { label: LinkAuditContent.columns.outgoing, value: formatNumber(outgoing.length) },
        { label: LinkAuditContent.columns.incoming, value: formatNumber(incoming.length) },
        {
          label: LinkAuditContent.columns.flags,
          value:
            flags.length === 0 ? (
              <span style={{ color: Theme.palette().textMuted }}>-</span>
            ) : (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {flags.map((flag) => (
                  <Badge key={flag} label={flag} tone="warning" showIcon={false} />
                ))}
              </div>
            ),
        },
      ]}
      actions={
        <>
          {outgoing.length > 0 && (
            <Button
              label={LinkAuditContent.exportLinks}
              iconName="ExcelDocument"
              onClick={() => exportReferenceLinks(reference)}
            />
          )}
          {reference.url && (
            <Button
              label={LinkAuditContent.openItem}
              iconName="OpenInNewWindow"
              href={absoluteFromServerRelative(reference.url, reference.siteUrl || window.location.href)}
            />
          )}
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[
        {
          key: "broken",
          title: LinkAuditContent.dialog.brokenLinks,
          content:
            broken.length === 0 ? (
              <Badge label={LinkAuditContent.dialog.noBroken} tone="success" />
            ) : (
              <Table
                ariaLabel={LinkAuditContent.dialog.brokenLinks}
                rows={broken}
                columns={outgoingColumns}
                getRowKey={(link) => `${link.url}-${link.source}-${link.sourceLabel}-${link.text}`}
                hideFilters
                compact
                fill
              />
            ),
        },
        {
          key: "outgoing",
          title: LinkAuditContent.dialog.outgoing,
          content:
            outgoing.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{LinkAuditContent.dialog.noOutgoing}</p>
            ) : (
              <Table
                ariaLabel={LinkAuditContent.dialog.outgoing}
                rows={outgoing}
                columns={outgoingColumns}
                getRowKey={(link) => `${link.url}-${link.source}-${link.sourceLabel}-${link.text}`}
                searchValue={(link) => `${link.url} ${link.text} ${link.sourceLabel} ${link.targetTitle}`}
                searchLabel={LinkAuditContent.search.links}
                compact
                maxHeight={420}
              />
            ),
        },
        {
          key: "incoming",
          title: LinkAuditContent.dialog.incoming,
          content:
            incoming.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{LinkAuditContent.dialog.noIncoming}</p>
            ) : (
              <Table
                ariaLabel={LinkAuditContent.dialog.incoming}
                rows={incoming}
                columns={incomingColumns}
                getRowKey={(summary) => `${summary.key}-${summary.source}-${summary.sourceLabel}`}
                searchValue={(summary) => `${summary.title} ${summary.url} ${summary.listTitle}`}
                searchLabel={LinkAuditContent.search.references}
                compact
                maxHeight={420}
              />
            ),
        },
      ]}
    />
  );
};
