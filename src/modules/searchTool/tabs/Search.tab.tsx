import * as React from "react";
import { Table } from "@/components/data/Table";
import { Accordion } from "@/components/layout/Accordion";
import { Toolbar } from "@/components/layout/Toolbar";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { Notice } from "@/components/feedback/Notice";
import { Spinner } from "@/components/feedback/Spinner";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SearchOutcome, SearchRow } from "@/api/Search.types";
import { Refinement } from "@/modules/searchTool/SearchTool.types";
import { SearchToolContent } from "@/modules/searchTool/SearchTool.content";
import { pathOf } from "@/modules/searchTool/SearchTool.logic";
import { formatDateTime, formatDuration, formatNumber } from "@/utils/Format.util";
import { downloadCsv } from "@/utils/Export.util";

export interface SearchTabProps {
  outcome?: SearchOutcome;
  busy: boolean;
  error?: string;
  page: number;
  rowLimit: number;
  refinements: Refinement[];
  onPage: (page: number) => void;
  onRefine: (refinement: Refinement) => void;
  onRemoveRefinement: (token: string) => void;
  onClearRefiners: () => void;
  onSelect: (row: SearchRow) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  outcome,
  busy,
  error,
  page,
  rowLimit,
  refinements,
  onPage,
  onRefine,
  onRemoveRefinement,
  onClearRefiners,
  onSelect,
}) => {
  if (error) {
    return (
      <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
        <Notice tone="error" message={SearchToolContent.results.failed} />
        <pre
          style={{
            margin: 0,
            padding: Theme.tokens.space.md,
            background: Theme.tone("danger").bg,
            border: `1px solid ${Theme.tone("danger").border}`,
            borderRadius: Theme.tokens.radius.sm,
            fontSize: Theme.tokens.font.sm,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {error}
        </pre>
        {refinements.length > 0 && (
          <div>
            <Button label={SearchToolContent.results.clearRefiners} onClick={onClearRefiners} />
          </div>
        )}
      </div>
    );
  }

  if (busy && !outcome) return <Spinner label="Searching" />;

  if (!outcome) {
    return (
      <EmptyState
        title={SearchToolContent.results.idle.title}
        description={SearchToolContent.results.idle.description}
        iconName="Search"
      />
    );
  }

  if (outcome.rows.length === 0) {
    return (
      <EmptyState
        title={SearchToolContent.results.empty.title}
        description={SearchToolContent.results.empty.description}
        iconName="SearchIssue"
      />
    );
  }

  const columns = buildColumns(outcome.properties, onSelect);
  const lastPage = Math.max(0, Math.ceil(outcome.totalRows / rowLimit) - 1);

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.md, minWidth: 0 }}>
      <Toolbar ariaLabel={SearchToolContent.results.title}>
        <Badge
          label={`${formatNumber(outcome.totalRows)} ${SearchToolContent.results.summary}`}
          tone="info"
          showIcon={false}
        />
        <span style={{ color: Theme.palette().textMuted, fontSize: Theme.tokens.font.sm }}>
          {SearchToolContent.results.elapsed} {formatDuration(outcome.elapsedMs)}
        </span>

        <span style={{ flex: "1 1 auto" }} />

        <Button
          label={SearchToolContent.form.exportCsv}
          iconName="ExcelDocument"
          onClick={() => downloadCsv("search-results", outcome.rows as Record<string, unknown>[])}
        />
        <Button
          label={SearchToolContent.results.previous}
          iconName="ChevronLeft"
          disabled={page === 0 || busy}
          onClick={() => onPage(page - 1)}
        />
        <span style={{ fontSize: Theme.tokens.font.sm }}>
          {SearchToolContent.results.page} {page + 1}
        </span>
        <Button
          label={SearchToolContent.results.next}
          iconName="ChevronRight"
          disabled={page >= lastPage || busy}
          onClick={() => onPage(page + 1)}
        />
      </Toolbar>

      {refinements.length > 0 && (
        <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            {SearchToolContent.results.refinedBy}
          </span>
          {refinements.map((refinement) => (
            <Button
              key={refinement.token}
              label={`${refinement.refiner}: ${refinement.value}`}
              iconName="Cancel"
              variant="subtle"
              onClick={() => onRemoveRefinement(refinement.token)}
            />
          ))}
          <Button label={SearchToolContent.results.clearRefiners} variant="subtle" onClick={onClearRefiners} />
        </div>
      )}

      {outcome.refiners.length > 0 && (
        <Accordion title={SearchToolContent.results.refiners} subtitle={SearchToolContent.results.refinersHint}>
          <div style={{ display: "grid", gap: Theme.tokens.space.md }}>
            {outcome.refiners.map((refiner) => (
              <div key={refiner.name}>
                <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginBottom: 4 }}>
                  {refiner.name}
                </div>
                <div style={{ display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" }}>
                  {refiner.entries.slice(0, 12).map((entry) => (
                    <Button
                      key={entry.token}
                      label={`${entry.value} (${formatNumber(entry.count)})`}
                      variant="subtle"
                      onClick={() =>
                        onRefine({ refiner: refiner.name, token: entry.token, value: entry.value })
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Accordion>
      )}

      <Table
        ariaLabel={SearchToolContent.results.title}
        rows={outcome.rows}
        columns={columns}
        getRowKey={(row) => pathOf(row) || String(row.DocId ?? Math.random())}
        searchValue={(row) => Object.values(row).join(" ")}
        searchLabel="Filter these results"
        onRowClick={onSelect}
        compact
        fill
      />
    </div>
  );
};

function buildColumns(properties: string[], onSelect: (row: SearchRow) => void): TableColumn<SearchRow>[] {
  const preferred = ["Title", "Path", "FileType", "LastModifiedTime", "Author", "contentclass", "SPWebUrl"];
  const ordered = [...preferred.filter((key) => properties.indexOf(key) !== -1), ...properties.filter((key) => preferred.indexOf(key) === -1)];

  const columns: TableColumn<SearchRow>[] = ordered.slice(0, 8).map((property) => ({
    key: property,
    header: property,
    minWidth: property === "Path" ? 320 : 160,
    maxWidth: property === "Path" ? 420 : 260,
    sortValue: (row) => row[property] ?? "",
    filterValue: ["FileType", "contentclass", "SPWebUrl"].indexOf(property) === -1 ? undefined : (row) => row[property] ?? "",
    render: (row) => (
      <span style={{ wordBreak: "break-word" }}>
        {property === "LastModifiedTime" ? formatDateTime(row[property]) : row[property] ?? ""}
      </span>
    ),
  }));

  columns.push({
    key: "actions",
    header: "Actions",
    minWidth: 150,
    render: (row) => (
      <div style={{ display: "flex", gap: 4 }}>
        <Button label={SearchToolContent.results.details} variant="subtle" onClick={() => onSelect(row)} />
        {pathOf(row) && (
          <Button
            label={SearchToolContent.results.open}
            variant="subtle"
            iconName="OpenInNewWindow"
            href={pathOf(row)}
          />
        )}
      </div>
    ),
  });

  return columns;
}
