import * as React from "react";
import { Table } from "@/components/data/Table";
import { Button } from "@/components/actions/Button";
import { Toolbar } from "@/components/layout/Toolbar";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SearchToolContent } from "@/modules/searchTool/SearchTool.content";
import { HistoryEntry } from "@/modules/searchTool/SearchTool.types";
import { formatDateTime, formatDuration, formatNumber } from "@/utils/Format.util";

export interface HistoryTabProps {
  entries: HistoryEntry[];
  onRerun: (queryText: string) => void;
  onClear: () => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ entries, onRerun, onClear }) => {
  if (entries.length === 0) {
    return (
      <EmptyState
        title={SearchToolContent.history.empty.title}
        description={SearchToolContent.history.empty.description}
        iconName="History"
      />
    );
  }

  const columns: TableColumn<HistoryEntry>[] = [
    {
      key: "iso",
      header: SearchToolContent.history.when,
      minWidth: 180,
      sortValue: (entry) => entry.iso,
      render: (entry) => <span>{formatDateTime(entry.iso)}</span>,
    },
    {
      key: "queryText",
      header: SearchToolContent.history.query,
      minWidth: 380,
      maxWidth: 620,
      sortValue: (entry) => entry.queryText,
      render: (entry) => (
        <code style={{ fontSize: Theme.tokens.font.sm, wordBreak: "break-word" }}>{entry.queryText}</code>
      ),
    },
    {
      key: "totalRows",
      header: SearchToolContent.history.rows,
      minWidth: 110,
      sortValue: (entry) => entry.totalRows,
      render: (entry) => <span>{formatNumber(entry.totalRows)}</span>,
    },
    {
      key: "elapsedMs",
      header: SearchToolContent.history.time,
      minWidth: 110,
      sortValue: (entry) => entry.elapsedMs,
      render: (entry) => <span>{formatDuration(entry.elapsedMs)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: 130,
      render: (entry) => (
        <Button
          label={SearchToolContent.history.rerun}
          variant="subtle"
          iconName="Play"
          onClick={() => onRerun(entry.queryText)}
        />
      ),
    },
  ];

  return (
    <>
      <Toolbar ariaLabel={SearchToolContent.history.title}>
        <Button label={SearchToolContent.history.clear} iconName="Delete" onClick={onClear} />
      </Toolbar>

      <Table
        ariaLabel={SearchToolContent.history.title}
        rows={entries}
        columns={columns}
        getRowKey={(entry) => `${entry.iso}-${entry.queryText}`}
        initialSortKey="iso"
        initialSortDescending
      />
    </>
  );
};
