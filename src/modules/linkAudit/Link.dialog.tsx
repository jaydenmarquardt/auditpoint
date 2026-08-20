import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Table } from "@/components/data/Table";
import { Theme } from "@/theme/Theme.api";
import { LinkAuditContent } from "@/modules/linkAudit/LinkAudit.content";
import { StatusTag, TypeTag, usageColumns } from "@/modules/linkAudit/LinkAudit.columns";
import { exportLinkUsages } from "@/modules/linkAudit/LinkAudit.csv";
import { AggregatedLink } from "@/modules/linkAudit/LinkAudit.types";
import { formatNumber } from "@/utils/Format.util";

export interface LinkDialogProps {
  link?: AggregatedLink;
  origin: string;
  onDismiss: () => void;
}

export const LinkDialog: React.FC<LinkDialogProps> = ({ link, origin, onDismiss }) => {
  if (!link) return null;

  return (
    <PreviewDialog
      open={Boolean(link)}
      onDismiss={onDismiss}
      width="full"
      title={link.url || link.key}
      description={`${LinkAuditContent.columns.uses}: ${formatNumber(link.count)}`}
      facts={[
        { label: LinkAuditContent.columns.type, value: <TypeTag type={link.linkType} /> },
        {
          label: LinkAuditContent.columns.status,
          value: <StatusTag broken={link.broken} status={link.status} matched={link.targetTitle} />,
        },
        { label: LinkAuditContent.columns.resolvesTo, value: link.targetTitle || "-" },
        { label: LinkAuditContent.columns.spellings, value: formatNumber(link.variants.length) },
        { label: LinkAuditContent.columns.source, value: link.sourceLists.join(", ") || "-" },
      ]}
      actions={
        <>
          {link.usages.length > 0 && (
            <Button
              label={LinkAuditContent.exportUsages}
              iconName="ExcelDocument"
              onClick={() => exportLinkUsages(link, origin)}
            />
          )}
          {link.url && link.linkType !== "anchor" && link.linkType !== "script" && (
            <Button label={LinkAuditContent.openLink} iconName="OpenInNewWindow" href={link.url} />
          )}
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[
        {
          key: "variants",
          title: `${LinkAuditContent.dialog.variants} (${link.variants.length})`,
          content: (
            <ul style={{ margin: 0, paddingLeft: Theme.tokens.space.lg }}>
              {link.variants.map((variant) => (
                <li key={variant} style={{ wordBreak: "break-all" }}>
                  {variant}
                </li>
              ))}
            </ul>
          ),
        },
        {
          key: "usages",
          title: `${LinkAuditContent.dialog.usedIn} (${link.usages.length})`,
          content: (
            <Table
              ariaLabel={LinkAuditContent.dialog.usedIn}
              rows={link.usages}
              columns={usageColumns}
              getRowKey={(usage) => `${usage.reference.key}-${usage.reference.source}-${usage.reference.sourceLabel}-${usage.link.url}`}
              searchValue={(usage) => `${usage.reference.title} ${usage.reference.url} ${usage.link.text}`}
              searchLabel={LinkAuditContent.search.broken}
              compact
              maxHeight={420}
            />
          ),
        },
      ]}
    />
  );
};
