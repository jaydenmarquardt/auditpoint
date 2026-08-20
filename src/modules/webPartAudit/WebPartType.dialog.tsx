import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Table } from "@/components/data/Table";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { WebPartInstance } from "@/api/WebParts.types";
import { propertyUsage, PropertyUsage } from "@/modules/webPartAudit/WebPartAudit.logic";
import { WebPartTypeSummary } from "@/modules/webPartAudit/WebPartAudit.types";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { formatNumber } from "@/utils/Format.util";
import { exportTypeInstances } from "@/modules/webPartAudit/WebPartAudit.csv";

export interface WebPartTypeDialogProps {
  type?: WebPartTypeSummary;
  instances: WebPartInstance[];
  onDismiss: () => void;
  onOpenPage: (instance: WebPartInstance) => void;
}

export const WebPartTypeDialog: React.FC<WebPartTypeDialogProps> = ({
  type,
  instances,
  onDismiss,
  onOpenPage,
}) => {
  if (!type) return null;

  const mine = instances.filter((instance) => (instance.webPartId || instance.name) === type.key);
  const usage = propertyUsage(mine);

  const usageColumns: TableColumn<PropertyUsage>[] = [
    {
      key: "key",
      header: WebPartAuditContent.dialog.property,
      minWidth: 200,
      sortValue: (row) => row.key,
      render: (row) => <code style={{ fontSize: Theme.tokens.font.sm }}>{row.key}</code>,
    },
    {
      key: "present",
      header: WebPartAuditContent.dialog.usedOn,
      minWidth: 160,
      sortValue: (row) => row.present,
      render: (row) => (
        <span>
          {formatNumber(row.present)} of {formatNumber(mine.length)} ({row.percent}%)
        </span>
      ),
    },
    {
      key: "values",
      header: WebPartAuditContent.dialog.commonValues,
      minWidth: 320,
      maxWidth: 520,
      render: (row) => (
        <span style={{ color: Theme.palette().textMuted }}>
          {row.topValues.map((value) => `${value.value} (${value.count})`).join(", ") || WebPartAuditContent.none}
        </span>
      ),
    },
  ];

  const pageColumns: TableColumn<WebPartInstance>[] = [
    {
      key: "page",
      header: WebPartAuditContent.columns.page,
      minWidth: 280,
      sortValue: (instance) => instance.pageTitle,
      render: (instance) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600 }}>{instance.pageTitle}</div>
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{instance.pageUrl}</div>
        </div>
      ),
    },
    {
      key: "title",
      header: WebPartAuditContent.columns.title,
      minWidth: 180,
      sortValue: (instance) => instance.title,
      render: (instance) => <span>{instance.title || WebPartAuditContent.none}</span>,
    },
    {
      key: "section",
      header: WebPartAuditContent.columns.section,
      minWidth: 130,
      sortValue: (instance) => instance.section * 100 + instance.column,
      render: (instance) => (
        <span>
          {instance.layer === 1 ? WebPartAuditContent.titleArea : `${instance.section + 1}.${instance.column + 1}`}
        </span>
      ),
    },
    {
      key: "open",
      header: WebPartAuditContent.columns.actions,
      minWidth: 130,
      render: (instance) => (
        <Button
          label={WebPartAuditContent.dialog.openPage}
          variant="subtle"
          iconName="Page"
          onClick={() => {
            onDismiss();
            onOpenPage(instance);
          }}
        />
      ),
    },
  ];

  return (
    <PreviewDialog
      open={Boolean(type)}
      onDismiss={onDismiss}
      title={type.name}
      description={type.description || undefined}
      facts={[
        { label: WebPartAuditContent.columns.instances, value: formatNumber(type.instances) },
        { label: WebPartAuditContent.columns.pages, value: formatNumber(type.pages) },
        { label: WebPartAuditContent.columns.group, value: type.group || WebPartAuditContent.none },
        {
          label: WebPartAuditContent.columns.catalogue,
          value: (
            <Badge
              label={type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue}
              tone={type.inCatalogue ? "success" : "warning"}
            />
          ),
        },
        { label: WebPartAuditContent.columns.id, value: <code>{type.webPartId || WebPartAuditContent.none}</code> },
        {
          label: WebPartAuditContent.dialog.commonProperties,
          value: type.commonPropertyKeys.join(", ") || WebPartAuditContent.none,
        },
      ]}
      actions={
        <>
          <Button
            label={WebPartAuditContent.exportCsv}
            iconName="ExcelDocument"
            onClick={() => exportTypeInstances(type.name, mine)}
          />
          <Button label={WebPartAuditContent.dialog.close} variant="primary" onClick={onDismiss} />
        </>
      }
      sections={[
        {
          key: "usage",
          title: WebPartAuditContent.dialog.propertyUsage,
          content: (
            <Table
              ariaLabel={WebPartAuditContent.dialog.propertyUsage}
              rows={usage}
              columns={usageColumns}
              getRowKey={(row) => row.key}
              initialSortKey="present"
              initialSortDescending
              maxHeight={320}
            />
          ),
        },
        {
          key: "shared",
          title: WebPartAuditContent.dialog.sharedValues,
          content:
            type.sharedValues.length === 0 ? (
              <p style={{ margin: 0, color: Theme.palette().textMuted }}>{WebPartAuditContent.dialog.noShared}</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: Theme.tokens.space.lg }}>
                {type.sharedValues.map((entry) => (
                  <li key={entry.key}>
                    <code>{entry.key}</code>: {entry.value}
                  </li>
                ))}
              </ul>
            ),
        },
        {
          key: "pages",
          title: WebPartAuditContent.dialog.whereUsed,
          content: (
            <Table
              ariaLabel={WebPartAuditContent.dialog.whereUsed}
              rows={mine}
              columns={pageColumns}
              getRowKey={(instance) => `${instance.pageId}-${instance.instanceId}`}
              searchValue={(instance) => `${instance.pageTitle} ${instance.pageUrl} ${instance.title}`}
              searchLabel={WebPartAuditContent.searchInstances}
              maxHeight={380}
            />
          ),
        },
      ]}
    />
  );
};
