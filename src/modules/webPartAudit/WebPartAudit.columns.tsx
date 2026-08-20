import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { Button } from "@/components/actions/Button";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { WebPartInstance } from "@/api/WebParts.types";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartPageSummary, WebPartTypeSummary } from "@/modules/webPartAudit/WebPartAudit.types";
import { formatDate, formatNumber } from "@/utils/Format.util";

export function sourceLabel(isOutOfBox: boolean, isThirdParty: boolean): string {
  if (isOutOfBox) return WebPartAuditContent.outOfBox;
  if (isThirdParty) return WebPartAuditContent.thirdParty;
  return WebPartAuditContent.text;
}

export function densityLabel(count: number): string {
  if (count === 0) return WebPartAuditContent.density.empty;
  if (count <= 5) return WebPartAuditContent.density.light;
  if (count <= 15) return WebPartAuditContent.density.medium;
  return WebPartAuditContent.density.heavy;
}

export const typeColumns: TableColumn<WebPartTypeSummary>[] = [
  {
    key: "name",
    header: WebPartAuditContent.columns.name,
    minWidth: 240,
    maxWidth: 320,
    sortValue: (type) => type.name,
    render: (type) => (
      <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, minWidth: 0 }}>
        {type.iconUrl ? (
          <img src={type.iconUrl} alt="" width={16} height={16} style={{ flex: "0 0 auto" }} />
        ) : (
          <i
            className={`ms-Icon ms-Icon--${type.iconName || "Puzzle"}`}
            aria-hidden="true"
            style={{ color: Theme.palette().accent }}
          />
        )}

        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{type.name}</div>
          {type.description && (
            <div
              title={type.description}
              style={{
                fontSize: Theme.tokens.font.sm,
                color: Theme.palette().textMuted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {type.description}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "group",
    header: WebPartAuditContent.columns.group,
    minWidth: 140,
    sortValue: (type) => type.group,
    filterValue: (type) => type.group || WebPartAuditContent.none,
    render: (type) => <span>{type.group || WebPartAuditContent.none}</span>,
  },
  {
    key: "source",
    header: WebPartAuditContent.columns.source,
    minWidth: 150,
    sortValue: (type) => (type.isOutOfBox ? "0" : "1"),
    filterValue: (type) => sourceLabel(type.isOutOfBox, type.isThirdParty),
    render: (type) => (
      <Badge label={sourceLabel(type.isOutOfBox, type.isThirdParty)} tone={type.isThirdParty ? "warning" : "info"} />
    ),
  },
  {
    key: "catalogue",
    header: WebPartAuditContent.columns.catalogue,
    minWidth: 130,
    sortValue: (type) => (type.inCatalogue ? 0 : 1),
    filterValue: (type) => (type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue),
    render: (type) => (
      <Badge
        label={type.inCatalogue ? WebPartAuditContent.inCatalogue : WebPartAuditContent.notInCatalogue}
        tone={type.inCatalogue ? "success" : "warning"}
      />
    ),
  },
  {
    key: "instances",
    header: WebPartAuditContent.columns.instances,
    minWidth: 110,
    sortValue: (type) => type.instances,
    render: (type) => <span>{formatNumber(type.instances)}</span>,
  },
  {
    key: "pages",
    header: WebPartAuditContent.columns.pages,
    minWidth: 100,
    sortValue: (type) => type.pages,
    render: (type) => <span>{formatNumber(type.pages)}</span>,
  },
  {
    key: "properties",
    header: WebPartAuditContent.columns.properties,
    minWidth: 120,
    sortValue: (type) => type.propertyKeys.length,
    render: (type) => <span>{formatNumber(type.propertyKeys.length)}</span>,
  },
];

export function instanceColumns(onOpenPage: (instance: WebPartInstance) => void): TableColumn<WebPartInstance>[] {
  return [
    {
      key: "name",
      header: WebPartAuditContent.columns.name,
      minWidth: 200,
      sortValue: (instance) => instance.name,
      filterValue: (instance) => instance.name,
      render: (instance) => <span style={{ fontWeight: 600 }}>{instance.name}</span>,
    },
    {
      key: "page",
      header: WebPartAuditContent.columns.page,
      minWidth: 260,
      maxWidth: 340,
      sortValue: (instance) => instance.pageTitle,
      filterValue: (instance) => instance.pageTitle,
      render: (instance) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{instance.pageTitle}</div>
          <div
            style={{
              fontSize: Theme.tokens.font.sm,
              color: Theme.palette().textMuted,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {instance.pageUrl}
          </div>
        </div>
      ),
    },
    {
      key: "title",
      header: WebPartAuditContent.columns.title,
      minWidth: 200,
      sortValue: (instance) => instance.title,
      render: (instance) => (
        <span style={{ fontWeight: instance.title ? 600 : 400 }}>
          {instance.title || WebPartAuditContent.none}
        </span>
      ),
    },
    {
      key: "section",
      header: WebPartAuditContent.columns.section,
      minWidth: 130,
      sortValue: (instance) => instance.section * 100 + instance.column,
      filterValue: (instance) => (instance.layer === 1 ? WebPartAuditContent.titleArea : WebPartAuditContent.body),
      render: (instance) => (
        <span>
          {instance.layer === 1 ? WebPartAuditContent.titleArea : `${instance.section + 1}.${instance.column + 1}`}
        </span>
      ),
    },
    {
      key: "titled",
      header: WebPartAuditContent.columns.hasTitle,
      minWidth: 120,
      sortValue: (instance) => (instance.title ? 0 : 1),
      filterValue: (instance) => (instance.title ? WebPartAuditContent.titled : WebPartAuditContent.untitled),
      render: (instance) => (
        <Badge
          label={instance.title ? WebPartAuditContent.titled : WebPartAuditContent.untitled}
          tone={instance.title ? "success" : "neutral"}
          showIcon={false}
        />
      ),
    },
    {
      key: "properties",
      header: WebPartAuditContent.columns.properties,
      minWidth: 140,
      sortValue: (instance) => instance.propertyKeys.length,
      render: (instance) => (
        <Button
          label={`${instance.propertyKeys.length} ${WebPartAuditContent.viewProperties.toLowerCase()}`}
          variant="subtle"
          onClick={() => onOpenPage(instance)}
        />
      ),
    },
  ];
}

export const pageColumns: TableColumn<WebPartPageSummary>[] = [
  {
    key: "title",
    header: WebPartAuditContent.columns.page,
    minWidth: 280,
    maxWidth: 380,
    sortValue: (page) => page.title,
    render: (page) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{page.title}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {page.url}
        </div>
      </div>
    ),
  },
  {
    key: "layout",
    header: WebPartAuditContent.columns.layout,
    minWidth: 150,
    sortValue: (page) => page.pageLayout,
    filterValue: (page) => page.pageLayout || "Unknown",
    render: (page) => <Badge label={page.pageLayout || "Unknown"} tone="neutral" showIcon={false} />,
  },
  {
    key: "count",
    header: WebPartAuditContent.columns.count,
    minWidth: 120,
    sortValue: (page) => page.webPartCount,
    render: (page) => <span>{formatNumber(page.webPartCount)}</span>,
  },
  {
    key: "sections",
    header: WebPartAuditContent.columns.sections,
    minWidth: 110,
    sortValue: (page) => page.sections,
    render: (page) => <span>{formatNumber(page.sections)}</span>,
  },
  {
    key: "density",
    header: WebPartAuditContent.columns.density,
    minWidth: 130,
    sortValue: (page) => page.webPartCount,
    filterValue: (page) => densityLabel(page.webPartCount),
    render: (page) => <Badge label={densityLabel(page.webPartCount)} tone="neutral" showIcon={false} />,
  },
  {
    key: "modified",
    header: WebPartAuditContent.columns.modified,
    minWidth: 150,
    sortValue: (page) => page.modified,
    render: (page) => <span>{formatDate(page.modified)}</span>,
  },
];
