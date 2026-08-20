import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";

type CatalogueRow = WebPartAuditView["catalogueOnly"][number];

const columns: TableColumn<CatalogueRow>[] = [
  {
    key: "title",
    header: WebPartAuditContent.columns.name,
    minWidth: 280,
    sortValue: (entry) => entry.title,
    render: (entry) => (
      <span style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm }}>
        <i className={`ms-Icon ms-Icon--${entry.iconName || "Puzzle"}`} aria-hidden="true" />
        {entry.title}
      </span>
    ),
  },
  {
    key: "group",
    header: WebPartAuditContent.columns.group,
    minWidth: 180,
    sortValue: (entry) => entry.group,
    filterValue: (entry) => entry.group || WebPartAuditContent.none,
    render: (entry) => <span>{entry.group || WebPartAuditContent.none}</span>,
  },
  {
    key: "id",
    header: WebPartAuditContent.columns.id,
    minWidth: 320,
    sortValue: (entry) => entry.id,
    render: (entry) => <code style={{ fontSize: Theme.tokens.font.sm }}>{entry.id}</code>,
  },
];

export const CatalogueTab: React.FC<{ rows: CatalogueRow[] }> = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={WebPartAuditContent.catalogueEmpty.title}
        description={WebPartAuditContent.catalogueEmpty.description}
        iconName="CheckMark"
      />
    );
  }

  return (
    <Table
      ariaLabel={WebPartAuditContent.tabs.catalogue}
      rows={rows}
      columns={columns}
      getRowKey={(entry) => entry.id}
      searchValue={(entry) => `${entry.title} ${entry.group} ${entry.id}`}
      searchLabel={WebPartAuditContent.searchTypes}
    />
  );
};
