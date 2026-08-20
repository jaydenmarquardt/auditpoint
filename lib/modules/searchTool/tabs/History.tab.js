import * as React from "react";
import { Table } from "../../../components/data/Table";
import { Button } from "../../../components/actions/Button";
import { Toolbar } from "../../../components/layout/Toolbar";
import { EmptyState } from "../../../components/states/Empty.state";
import { Theme } from "../../../theme/Theme.api";
import { SearchToolContent } from "../SearchTool.content";
import { formatDateTime, formatDuration, formatNumber } from "../../../utils/Format.util";
export const HistoryTab = ({ entries, onRerun, onClear }) => {
    if (entries.length === 0) {
        return (React.createElement(EmptyState, { title: SearchToolContent.history.empty.title, description: SearchToolContent.history.empty.description, iconName: "History" }));
    }
    const columns = [
        {
            key: "iso",
            header: SearchToolContent.history.when,
            minWidth: 180,
            sortValue: (entry) => entry.iso,
            render: (entry) => React.createElement("span", null, formatDateTime(entry.iso)),
        },
        {
            key: "queryText",
            header: SearchToolContent.history.query,
            minWidth: 380,
            maxWidth: 620,
            sortValue: (entry) => entry.queryText,
            render: (entry) => (React.createElement("code", { style: { fontSize: Theme.tokens.font.sm, wordBreak: "break-word" } }, entry.queryText)),
        },
        {
            key: "totalRows",
            header: SearchToolContent.history.rows,
            minWidth: 110,
            sortValue: (entry) => entry.totalRows,
            render: (entry) => React.createElement("span", null, formatNumber(entry.totalRows)),
        },
        {
            key: "elapsedMs",
            header: SearchToolContent.history.time,
            minWidth: 110,
            sortValue: (entry) => entry.elapsedMs,
            render: (entry) => React.createElement("span", null, formatDuration(entry.elapsedMs)),
        },
        {
            key: "actions",
            header: "Actions",
            minWidth: 130,
            render: (entry) => (React.createElement(Button, { label: SearchToolContent.history.rerun, variant: "subtle", iconName: "Play", onClick: () => onRerun(entry.queryText) })),
        },
    ];
    return (React.createElement(React.Fragment, null,
        React.createElement(Toolbar, { ariaLabel: SearchToolContent.history.title },
            React.createElement(Button, { label: SearchToolContent.history.clear, iconName: "Delete", onClick: onClear })),
        React.createElement(Table, { ariaLabel: SearchToolContent.history.title, rows: entries, columns: columns, getRowKey: (entry) => `${entry.iso}-${entry.queryText}`, initialSortKey: "iso", initialSortDescending: true })));
};
//# sourceMappingURL=History.tab.js.map