import * as React from "react";
import { ConstrainMode, DetailsList, DetailsListLayoutMode, DetailsRow, SelectionMode, } from "@fluentui/react/lib/DetailsList";
import { Dropdown } from "../inputs/Dropdown";
import { Picker } from "../inputs/Picker";
import { SearchBox } from "../inputs/SearchBox";
import { Button } from "../actions/Button";
import { Theme } from "../../theme/Theme.api";
const ALL = "__all";
const PAGE_SIZE = 100;
const COMBO_AFTER = 12;
/**
 * Fixed columns in an own-scroll wrapper, rendered a page at a time. Justified
 * layout and virtualisation both misbehave inside nested scroll containers.
 */
export function Table({ ariaLabel, columns, rows, getRowKey, onRowClick, compact, initialSortKey, initialSortDescending, hideFilters, emptyLabel = "No rows match the current filters.", searchValue, searchLabel = "Search", maxHeight = 620, fill, extraFilters, }) {
    const [sortKey, setSortKey] = React.useState(initialSortKey);
    const [descending, setDescending] = React.useState(Boolean(initialSortDescending));
    const [filters, setFilters] = React.useState({});
    const [search, setSearch] = React.useState("");
    const [limit, setLimit] = React.useState(PAGE_SIZE);
    const filterable = columns.filter((column) => column.filterValue);
    const visible = React.useMemo(() => {
        const term = search.trim().toLowerCase();
        const filtered = rows.filter((row) => {
            if (term.length > 0 && searchValue && searchValue(row).toLowerCase().indexOf(term) === -1)
                return false;
            return filterable.every((column) => {
                var _a;
                const selected = filters[column.key];
                if (!selected || selected === ALL)
                    return true;
                return ((_a = column.filterValue) === null || _a === void 0 ? void 0 : _a.call(column, row)) === selected;
            });
        });
        const sortColumn = columns.find((column) => column.key === sortKey && column.sortValue);
        if (!(sortColumn === null || sortColumn === void 0 ? void 0 : sortColumn.sortValue))
            return filtered;
        const sorted = [...filtered].sort((a, b) => compare(sortColumn.sortValue(a), sortColumn.sortValue(b)));
        return descending ? sorted.reverse() : sorted;
    }, [rows, columns, filters, filterable, sortKey, descending, search, searchValue]);
    React.useEffect(() => setLimit(PAGE_SIZE), [search, filters, sortKey, descending]);
    const page = visible.slice(0, limit);
    const fluentColumns = columns.map((column) => {
        var _a, _b, _c;
        return ({
            key: column.key,
            name: column.header,
            fieldName: column.key,
            minWidth: (_a = column.minWidth) !== null && _a !== void 0 ? _a : 100,
            maxWidth: (_c = (_b = column.maxWidth) !== null && _b !== void 0 ? _b : column.minWidth) !== null && _c !== void 0 ? _c : 100,
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
            onRender: (item) => column.render(item),
        });
    });
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.sm, minWidth: 0 } },
        !hideFilters && (filterable.length > 0 || searchValue || extraFilters) && (React.createElement("div", { role: "group", "aria-label": `${ariaLabel} filters`, style: { display: "flex", gap: Theme.tokens.space.sm, flexWrap: "wrap", alignItems: "flex-end" } },
            searchValue && React.createElement(SearchBox, { label: searchLabel, value: search, onChange: setSearch, width: 260 }),
            extraFilters,
            filterable.map((column) => {
                var _a;
                const options = optionsFor(column, rows);
                const selected = (_a = filters[column.key]) !== null && _a !== void 0 ? _a : ALL;
                return (React.createElement("div", { key: column.key, style: { minWidth: 190 } }, options.length > COMBO_AFTER ? (React.createElement(Picker, { label: column.header, options: options.filter((option) => option.key !== ALL), selectedKey: selected === ALL ? undefined : selected, onChange: (value) => setFilters((current) => (Object.assign(Object.assign({}, current), { [column.key]: value.length > 0 ? value : ALL }))) })) : (React.createElement(Dropdown, { label: column.header, options: options, selectedKey: selected, onChange: (value) => setFilters((current) => (Object.assign(Object.assign({}, current), { [column.key]: value }))) }))));
            }),
            (Object.values(filters).some((value) => value && value !== ALL) || search.length > 0) && (React.createElement(Button, { label: "Clear filters", variant: "subtle", iconName: "ClearFilter", onClick: () => {
                    setFilters({});
                    setSearch("");
                } })))),
        React.createElement("div", { style: {
                width: "100%",
                minWidth: 0,
                overflowX: "auto",
                overflowY: !fill && page.length > 12 ? "auto" : "visible",
                maxHeight: !fill && page.length > 12 ? maxHeight : undefined,
                border: `1px solid ${Theme.palette().border}`,
                borderRadius: Theme.tokens.radius.sm,
                background: Theme.palette().surface,
            } },
            React.createElement(DetailsList, { styles: {
                    root: { overflowX: "visible" },
                    headerWrapper: {
                        selectors: {
                            ".ms-DetailsHeader": {
                                paddingTop: 0,
                                borderBottom: `1px solid ${Theme.palette().border}`,
                            },
                        },
                    },
                }, ariaLabel: ariaLabel, items: page, columns: fluentColumns, getKey: (item) => getRowKey(item), selectionMode: SelectionMode.none, layoutMode: DetailsListLayoutMode.fixedColumns, constrainMode: ConstrainMode.horizontalConstrained, compact: compact, onShouldVirtualize: () => false, onRenderRow: (props) => {
                    if (!props)
                        return null;
                    if (!onRowClick)
                        return React.createElement(DetailsRow, Object.assign({}, props));
                    return (React.createElement("div", { role: "button", tabIndex: 0, style: { cursor: "pointer" }, onClick: (event) => {
                            // Buttons inside a cell own their own click.
                            if (event.target.closest("button, a"))
                                return;
                            onRowClick(props.item);
                        }, onKeyDown: (event) => {
                            if (event.key === "Enter")
                                onRowClick(props.item);
                        } },
                        React.createElement(DetailsRow, Object.assign({}, props))));
                }, checkButtonAriaLabel: "Select row" }),
            visible.length === 0 && (React.createElement("p", { style: { color: Theme.palette().textMuted, padding: Theme.tokens.space.md, margin: 0 } }, emptyLabel))),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: Theme.tokens.space.sm, flexWrap: "wrap" } },
            React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } },
                "Showing ",
                page.length.toLocaleString(),
                " of ",
                visible.length.toLocaleString(),
                visible.length === rows.length ? "" : ` (filtered from ${rows.length.toLocaleString()})`),
            visible.length > page.length && (React.createElement(React.Fragment, null,
                React.createElement(Button, { label: "Show more", iconName: "ChevronDown", onClick: () => setLimit(limit + PAGE_SIZE) }),
                React.createElement(Button, { label: "Show all", variant: "subtle", onClick: () => setLimit(visible.length) }))))));
}
function optionsFor(column, rows) {
    const values = [...new Set(rows.map((row) => { var _a, _b; return (_b = (_a = column.filterValue) === null || _a === void 0 ? void 0 : _a.call(column, row)) !== null && _b !== void 0 ? _b : ""; }).filter(Boolean))].sort();
    return [{ key: ALL, text: "All" }, ...values.map((value) => ({ key: value, text: value }))];
}
function compare(a, b) {
    if (typeof a === "number" && typeof b === "number")
        return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true });
}
//# sourceMappingURL=Table.js.map