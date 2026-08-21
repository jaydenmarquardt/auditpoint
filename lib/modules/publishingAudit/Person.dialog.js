import * as React from "react";
import { PreviewDialog } from "../../components/actions/PreviewDialog";
import { Button } from "../../components/actions/Button";
import { StatGrid } from "../../components/layout/StatGrid";
import { Table } from "../../components/data/Table";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { itemColumns } from "./PublishingAudit.columns";
import { formatDate, formatNumber } from "../../utils/Format.util";
const CONTENT = PublishingAuditContent.people;
export const PersonDialog = ({ person, onDismiss, onSelectItem }) => {
    if (!person)
        return null;
    return (React.createElement(PreviewDialog, { open: Boolean(person), onDismiss: onDismiss, width: "full", title: person.name, description: `${formatNumber(person.items.length)} items across ${formatNumber(person.lists.length)} lists`, facts: [
            { label: CONTENT.columns.created, value: formatNumber(person.created) },
            { label: CONTENT.columns.edited, value: formatNumber(person.edited) },
            { label: CONTENT.columns.lastEdit, value: person.lastEdit ? formatDate(person.lastEdit) : "-" },
            { label: CONTENT.columns.lists, value: person.lists.join(", ") || "-" },
        ], actions: React.createElement(Button, { label: "Close", variant: "primary", onClick: onDismiss }), sections: [
            {
                key: "stats",
                title: CONTENT.dialog.stats,
                content: (React.createElement(StatGrid, { minWidth: 170, tiles: [
                        { key: "items", label: CONTENT.columns.touched, value: formatNumber(person.items.length), iconName: "Documentation" },
                        { key: "created", label: CONTENT.columns.created, value: formatNumber(person.created), iconName: "NewFolder" },
                        { key: "edited", label: CONTENT.columns.edited, value: formatNumber(person.edited), iconName: "EditContact" },
                        {
                            key: "unpublished",
                            label: CONTENT.columns.unpublished,
                            value: formatNumber(person.unpublished),
                            tone: "warning",
                            iconName: "PageRemove",
                        },
                        { key: "stale", label: CONTENT.columns.stale, value: formatNumber(person.stale), iconName: "Clock" },
                        { key: "lists", label: CONTENT.columns.lists, value: formatNumber(person.lists.length), iconName: "BulletedList" },
                    ] })),
            },
            {
                key: "items",
                title: CONTENT.dialog.items,
                content: (React.createElement(Table, { ariaLabel: CONTENT.dialog.items, rows: person.items, columns: itemColumns, getRowKey: (item) => `${item.listId}-${item.itemId}`, onRowClick: onSelectItem, searchValue: (item) => `${item.title} ${item.listTitle} ${item.url}`, searchLabel: CONTENT.dialog.items, compact: true, maxHeight: 420 })),
            },
        ] }));
};
//# sourceMappingURL=Person.dialog.js.map