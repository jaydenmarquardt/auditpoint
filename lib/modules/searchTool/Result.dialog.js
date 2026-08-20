import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { Table } from "../../components/data/Table";
import { Theme } from "../../theme/Theme.api";
import { SearchToolContent } from "./SearchTool.content";
import { pathOf } from "./SearchTool.logic";
const columns = [
    {
        key: "key",
        header: "Managed property",
        minWidth: 240,
        sortValue: (row) => row.key,
        render: (row) => React.createElement("code", { style: { fontSize: Theme.tokens.font.sm } }, row.key),
    },
    {
        key: "value",
        header: "Value",
        minWidth: 420,
        maxWidth: 720,
        sortValue: (row) => row.value,
        render: (row) => React.createElement("span", { style: { wordBreak: "break-word" } }, row.value),
    },
];
export const ResultDialog = ({ row, onDismiss }) => {
    if (!row)
        return null;
    const properties = Object.entries(row)
        .filter(([, value]) => value !== null && value !== undefined && String(value).length > 0)
        .map(([key, value]) => ({ key, value: String(value) }))
        .sort((a, b) => a.key.localeCompare(b.key));
    const path = pathOf(row);
    return (React.createElement(PreviewDialog, { open: Boolean(row), onDismiss: onDismiss, title: row.Title || path || "Result", description: path, actions: React.createElement(React.Fragment, null,
            path && React.createElement(Button, { label: SearchToolContent.results.open, iconName: "OpenInNewWindow", href: path }),
            React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss })) },
        React.createElement(Table, { ariaLabel: "Managed properties", rows: properties, columns: columns, getRowKey: (property) => property.key, searchValue: (property) => `${property.key} ${property.value}`, searchLabel: "Search properties", maxHeight: 420 })));
};
//# sourceMappingURL=Result.dialog.js.map