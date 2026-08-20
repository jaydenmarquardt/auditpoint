import * as React from "react";
import { Table } from "../../../components/data/Table";
import { Accordion } from "../../../components/layout/Accordion";
import { Toolbar } from "../../../components/layout/Toolbar";
import { Button } from "../../../components/actions/Button";
import { Badge } from "../../../components/feedback/Badge";
import { Notice } from "../../../components/feedback/Notice";
import { Spinner } from "../../../components/feedback/Spinner";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { SearchToolContent } from "../SearchTool.content";
import { pathOf } from "../SearchTool.logic";
import { formatDateTime, formatDuration, formatNumber } from "../../../utils/Format.util";
import { downloadCsv } from "../../../utils/Export.util";
export const SearchTab = ({ outcome, busy, error, page, rowLimit, refinements, onPage, onRefine, onRemoveRefinement, onClearRefiners, onSelect, }) => {
    if (error) {
        return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } },
            React.createElement(Notice, { tone: "error", message: SearchToolContent.results.failed }),
            React.createElement("pre", { style: {
                    margin: 0,
                    padding: Theme.tokens.space.md,
                    background: Theme.tone("danger").bg,
                    border: `1px solid ${Theme.tone("danger").border}`,
                    borderRadius: Theme.tokens.radius.sm,
                    fontSize: Theme.tokens.font.sm,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                } }, error),
            refinements.length > 0 && (React.createElement("div", null,
                React.createElement(Button, { label: SearchToolContent.results.clearRefiners, onClick: onClearRefiners })))));
    }
    if (busy && !outcome)
        return React.createElement(Spinner, { label: "Searching" });
    if (!outcome) {
        return (React.createElement(EmptyState, { title: SearchToolContent.results.idle.title, description: SearchToolContent.results.idle.description, iconName: "Search" }));
    }
    if (outcome.rows.length === 0) {
        return (React.createElement(EmptyState, { title: SearchToolContent.results.empty.title, description: SearchToolContent.results.empty.description, iconName: "SearchIssue" }));
    }
    const columns = buildColumns(outcome.properties, onSelect);
    const lastPage = Math.max(0, Math.ceil(outcome.totalRows / rowLimit) - 1);
    return (React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md, minWidth: 0 } },
        React.createElement(Toolbar, { ariaLabel: SearchToolContent.results.title },
            React.createElement(Badge, { label: `${formatNumber(outcome.totalRows)} ${SearchToolContent.results.summary}`, tone: "info", showIcon: false }),
            React.createElement("span", { style: { color: Theme.palette().textMuted, fontSize: Theme.tokens.font.sm } },
                SearchToolContent.results.elapsed,
                " ",
                formatDuration(outcome.elapsedMs)),
            React.createElement("span", { style: { flex: "1 1 auto" } }),
            React.createElement(Button, { label: SearchToolContent.form.exportCsv, iconName: "ExcelDocument", onClick: () => downloadCsv("search-results", outcome.rows) }),
            React.createElement(Button, { label: SearchToolContent.results.previous, iconName: "ChevronLeft", disabled: page === 0 || busy, onClick: () => onPage(page - 1) }),
            React.createElement("span", { style: { fontSize: Theme.tokens.font.sm } },
                SearchToolContent.results.page,
                " ",
                page + 1),
            React.createElement(Button, { label: SearchToolContent.results.next, iconName: "ChevronRight", disabled: page >= lastPage || busy, onClick: () => onPage(page + 1) })),
        refinements.length > 0 && (React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap", alignItems: "center" } },
            React.createElement("span", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted } }, SearchToolContent.results.refinedBy),
            refinements.map((refinement) => (React.createElement(Button, { key: refinement.token, label: `${refinement.refiner}: ${refinement.value}`, iconName: "Cancel", variant: "subtle", onClick: () => onRemoveRefinement(refinement.token) }))),
            React.createElement(Button, { label: SearchToolContent.results.clearRefiners, variant: "subtle", onClick: onClearRefiners }))),
        outcome.refiners.length > 0 && (React.createElement(Accordion, { title: SearchToolContent.results.refiners, subtitle: SearchToolContent.results.refinersHint },
            React.createElement("div", { style: { display: "grid", gap: Theme.tokens.space.md } }, outcome.refiners.map((refiner) => (React.createElement("div", { key: refiner.name },
                React.createElement("div", { style: { fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, marginBottom: 4 } }, refiner.name),
                React.createElement("div", { style: { display: "flex", gap: Theme.tokens.space.xs, flexWrap: "wrap" } }, refiner.entries.slice(0, 12).map((entry) => (React.createElement(Button, { key: entry.token, label: `${entry.value} (${formatNumber(entry.count)})`, variant: "subtle", onClick: () => onRefine({ refiner: refiner.name, token: entry.token, value: entry.value }) })))))))))),
        React.createElement(Table, { ariaLabel: SearchToolContent.results.title, rows: outcome.rows, columns: columns, getRowKey: (row) => { var _a; return pathOf(row) || String((_a = row.DocId) !== null && _a !== void 0 ? _a : Math.random()); }, searchValue: (row) => Object.values(row).join(" "), searchLabel: "Filter these results", onRowClick: onSelect, compact: true, fill: true })));
};
function buildColumns(properties, onSelect) {
    const preferred = ["Title", "Path", "FileType", "LastModifiedTime", "Author", "contentclass", "SPWebUrl"];
    const ordered = [...preferred.filter((key) => properties.indexOf(key) !== -1), ...properties.filter((key) => preferred.indexOf(key) === -1)];
    const columns = ordered.slice(0, 8).map((property) => ({
        key: property,
        header: property,
        minWidth: property === "Path" ? 320 : 160,
        maxWidth: property === "Path" ? 420 : 260,
        sortValue: (row) => { var _a; return (_a = row[property]) !== null && _a !== void 0 ? _a : ""; },
        filterValue: ["FileType", "contentclass", "SPWebUrl"].indexOf(property) === -1 ? undefined : (row) => { var _a; return (_a = row[property]) !== null && _a !== void 0 ? _a : ""; },
        render: (row) => {
            var _a;
            return (React.createElement("span", { style: { wordBreak: "break-word" } }, property === "LastModifiedTime" ? formatDateTime(row[property]) : (_a = row[property]) !== null && _a !== void 0 ? _a : ""));
        },
    }));
    columns.push({
        key: "actions",
        header: "Actions",
        minWidth: 150,
        render: (row) => (React.createElement("div", { style: { display: "flex", gap: 4 } },
            React.createElement(Button, { label: SearchToolContent.results.details, variant: "subtle", onClick: () => onSelect(row) }),
            pathOf(row) && (React.createElement(Button, { label: SearchToolContent.results.open, variant: "subtle", iconName: "OpenInNewWindow", href: pathOf(row) })))),
    });
    return columns;
}
//# sourceMappingURL=Search.tab.js.map