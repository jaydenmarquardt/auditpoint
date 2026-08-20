import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Table } from "@/components/data/Table";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SearchRow } from "@/api/Search.types";
import { SearchToolContent } from "@/modules/searchTool/SearchTool.content";
import { pathOf } from "@/modules/searchTool/SearchTool.logic";

export interface ResultDialogProps {
  row?: SearchRow;
  onDismiss: () => void;
}

interface PropertyRow {
  key: string;
  value: string;
}

const columns: TableColumn<PropertyRow>[] = [
  {
    key: "key",
    header: "Managed property",
    minWidth: 240,
    sortValue: (row) => row.key,
    render: (row) => <code style={{ fontSize: Theme.tokens.font.sm }}>{row.key}</code>,
  },
  {
    key: "value",
    header: "Value",
    minWidth: 420,
    maxWidth: 720,
    sortValue: (row) => row.value,
    render: (row) => <span style={{ wordBreak: "break-word" }}>{row.value}</span>,
  },
];

export const ResultDialog: React.FC<ResultDialogProps> = ({ row, onDismiss }) => {
  if (!row) return null;

  const properties: PropertyRow[] = Object.entries(row)
    .filter(([, value]) => value !== null && value !== undefined && String(value).length > 0)
    .map(([key, value]) => ({ key, value: String(value) }))
    .sort((a, b) => a.key.localeCompare(b.key));

  const path = pathOf(row);

  return (
    <PreviewDialog
      open={Boolean(row)}
      onDismiss={onDismiss}
      title={row.Title || path || "Result"}
      description={path}
      actions={
        <>
          {path && <Button label={SearchToolContent.results.open} iconName="OpenInNewWindow" href={path} />}
          <Button label="Close" variant="primary" onClick={onDismiss} />
        </>
      }
    >
      <Table
        ariaLabel="Managed properties"
        rows={properties}
        columns={columns}
        getRowKey={(property) => property.key}
        searchValue={(property) => `${property.key} ${property.value}`}
        searchLabel="Search properties"
        maxHeight={420}
      />
    </PreviewDialog>
  );
};
