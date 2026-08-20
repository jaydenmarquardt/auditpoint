import * as React from "react";
import { Table } from "@/components/data/Table";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { IndexingAuditContent } from "@/modules/indexingAudit/IndexingAudit.content";

interface PropertyRow {
  name: string;
}

const columns: TableColumn<PropertyRow>[] = [
  {
    key: "name",
    header: IndexingAuditContent.columns.property,
    minWidth: 320,
    sortValue: (row) => row.name,
    render: (row) => <code style={{ fontSize: Theme.tokens.font.sm }}>{row.name}</code>,
  },
];

export const PropertiesTab: React.FC<{ properties: string[] }> = ({ properties }) => {
  if (properties.length === 0) {
    return (
      <EmptyState
        title={IndexingAuditContent.empty.title}
        description="Managed property listing was off for this run, or search returned no rows to read them from."
        iconName="Tag"
      />
    );
  }

  return (
    <Table
      ariaLabel={IndexingAuditContent.tabs.properties}
      rows={properties.map((name) => ({ name }))}
      columns={columns}
      getRowKey={(row) => row.name}
      initialSortKey="name"
      searchValue={(row) => row.name}
      searchLabel={IndexingAuditContent.searchProperties}
    />
  );
};
