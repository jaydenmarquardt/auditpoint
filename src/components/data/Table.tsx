import * as React from "react";
import {
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  DetailsRow,
  IColumn,
  IDetailsRowProps,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { Dropdown } from "@/components/inputs/Dropdown";
import { Picker } from "@/components/inputs/Picker";
import { SearchBox } from "@/components/inputs/SearchBox";
import { Button } from "@/components/actions/Button";
import { Theme } from "@/theme/Theme.api";
import { TableColumn, TableProps } from "@/components/Components.types";

const ALL = "__all";
const PAGE_SIZE = 100;
const COMBO_AFTER = 12;

/**
 * Fixed columns in an own-scroll wrapper, rendered a page at a time. Justified
 * layout and virtualisation both misbehave inside nested scroll containers.
 */
export function Table<TRow>({
  ariaLabel,
  columns,
  rows,
  getRowKey,
  onRowClick,
  compact,
  initialSortKey,
  initialSortDescending,
  hideFilters,
  emptyLabel = "No rows match the current filters.",
  searchValue,
  searchLabel = "Search",
  maxHeight = 620,
  fill,
  extraFilters,
}: TableProps<TRow>): React.ReactElement {
  const [sortKey, setSortKey] = React.useState<string | undefined>(initialSortKey);
  const [descending, setDescending] = React.useState(Boolean(initialSortDescending));
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState(PAGE_SIZE);

  const filterable = columns.filter((column) => column.filterValue);

  const visible = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = rows.filter((row) => {
      if (term.length > 0 && searchValue && searchValue(row).toLowerCase().indexOf(term) === -1) return false;

      return filterable.every((column) => {
        const selected = filters[column.key];
        if (!selected || selected === ALL) return true;
        return column.filterValue?.(row) === selected;
      });
    });

    const sortColumn = columns.find((column) => column.key === sortKey && column.sortValue);
    if (!sortColumn?.sortValue) return filtered;

    const sorted = [...filtered].sort((a, b) => compare(sortColumn.sortValue!(a), sortColumn.sortValue!(b)));
    return descending ? sorted.reverse() : sorted;
  }, [rows, columns, filters, filterable, sortKey, descending, search, searchValue]);

  React.useEffect(() => setLimit(PAGE_SIZE), [search, filters, sortKey, descending]);

  const page = visible.slice(0, limit);

  const fluentColumns: IColumn[] = columns.map((column) => ({
    key: column.key,
    name: column.header,
    fieldName: column.key,
    minWidth: column.minWidth ?? 100,
    maxWidth: column.maxWidth ?? column.minWidth ?? 100,
    isResizable: false,
    isMultiline: false,
    isPadded: true,
    isSorted: Boolean(column.sortValue) && sortKey === column.key,
    isSortedDescending: descending,
    sortAscendingAriaLabel: "Sorted ascending",
    sortDescendingAriaLabel: "Sorted descending",
    onColumnClick: column.sortValue
      ? () => {
          setDescending(sortKey === column.key ? !descending : false);
          setSortKey(column.key);
        }
      : undefined,
    onRender: (item?: unknown) => column.render(item as TRow),
  }));

  return (
    <div style={{ display: "grid", gap: Theme.tokens.space.sm, minWidth: 0 }}>
      {!hideFilters && (filterable.length > 0 || searchValue || extraFilters) && (
        <div
          role="group"
          aria-label={`${ariaLabel} filters`}
          style={{ display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap", alignItems: "flex-end" }}
        >
          {searchValue && <SearchBox label={searchLabel} value={search} onChange={setSearch} width={260} />}

          {extraFilters}

          {filterable.map((column) => {
            const options = optionsFor(column, rows);
            const selected = filters[column.key] ?? ALL;

            return (
              <div key={column.key} style={{ minWidth: 190 }}>
                {options.length > COMBO_AFTER ? (
                  <Picker
                    label={column.header}
                    options={options.filter((option) => option.key !== ALL)}
                    selectedKey={selected === ALL ? undefined : selected}
                    onChange={(value) =>
                      setFilters((current) => ({ ...current, [column.key]: value.length > 0 ? value : ALL }))
                    }
                  />
                ) : (
                  <Dropdown
                    label={column.header}
                    options={options}
                    selectedKey={selected}
                    onChange={(value) => setFilters((current) => ({ ...current, [column.key]: value }))}
                  />
                )}
              </div>
            );
          })}

          {(Object.values(filters).some((value) => value && value !== ALL) || search.length > 0) && (
            <Button
              label="Clear filters"
              variant="subtle"
              iconName="ClearFilter"
              onClick={() => {
                setFilters({});
                setSearch("");
              }}
            />
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          minWidth: 0,
          overflowX: "auto",
          overflowY: !fill && page.length > 12 ? "auto" : "visible",
          maxHeight: !fill && page.length > 12 ? maxHeight : undefined,
          border: `1px solid ${Theme.palette().border}`,
          borderRadius: Theme.tokens.radius.sm,
          background: Theme.palette().surface,
        }}
      >
        <DetailsList
          styles={{
            root: { overflowX: "visible" },
            headerWrapper: {
              selectors: {
                ".ms-DetailsHeader": {
                  paddingTop: 0,
                  borderBottom: `1px solid ${Theme.palette().border}`,
                },
              },
            },
          }}
          ariaLabel={ariaLabel}
          items={page}
          columns={fluentColumns}
          getKey={(item) => getRowKey(item as TRow)}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          constrainMode={ConstrainMode.horizontalConstrained}
          compact={compact}
          onShouldVirtualize={() => false}
          onRenderRow={(props?: IDetailsRowProps) => {
            if (!props) return null;
            if (!onRowClick) return <DetailsRow {...props} />;

            return (
              <div
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={(event) => {
                  // Buttons inside a cell own their own click.
                  if ((event.target as HTMLElement).closest("button, a")) return;
                  onRowClick(props.item as TRow);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onRowClick(props.item as TRow);
                }}
              >
                <DetailsRow {...props} />
              </div>
            );
          }}
          checkButtonAriaLabel="Select row"
        />

        {visible.length === 0 && (
          <p style={{ color: Theme.palette().textMuted, padding: Theme.tokens.space.md, margin: 0 }}>{emptyLabel}</p>
        )}
      </div>

      {visible.length > page.length && (
        <div style={{ display: "flex", alignItems: "center", gap: Theme.tokens.space.sm }}>
          <span style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>
            Showing {page.length.toLocaleString()} of {visible.length.toLocaleString()}
          </span>
          <Button label="Show more" iconName="ChevronDown" onClick={() => setLimit(limit + PAGE_SIZE)} />
          <Button label="Show all" variant="subtle" onClick={() => setLimit(visible.length)} />
        </div>
      )}
    </div>
  );
}

function optionsFor<TRow>(column: TableColumn<TRow>, rows: TRow[]): { key: string; text: string }[] {
  const values = [...new Set(rows.map((row) => column.filterValue?.(row) ?? "").filter(Boolean))].sort();
  return [{ key: ALL, text: "All" }, ...values.map((value) => ({ key: value, text: value }))];
}

function compare(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}
