import * as React from "react";
import { Table } from "../../components/data/Table";
import { Badge } from "../../components/feedback/Badge";
import { EmptyState } from "../../components/states/Empty.state";
import { PublishingAuditContent } from "./PublishingAudit.content";
import { formatDate, formatNumber } from "../../utils/Format.util";
const CONTENT = PublishingAuditContent.people;
export const peopleColumns = [
    {
        key: "name",
        header: CONTENT.columns.name,
        minWidth: 220,
        maxWidth: 320,
        sortValue: (person) => person.name,
        render: (person) => React.createElement("span", { style: { fontWeight: 600 } }, person.name),
    },
    {
        key: "touched",
        header: CONTENT.columns.touched,
        minWidth: 110,
        sortValue: (person) => person.items.length,
        render: (person) => React.createElement("span", null, formatNumber(person.items.length)),
    },
    {
        key: "created",
        header: CONTENT.columns.created,
        minWidth: 110,
        sortValue: (person) => person.created,
        render: (person) => React.createElement("span", null, formatNumber(person.created)),
    },
    {
        key: "edited",
        header: CONTENT.columns.edited,
        minWidth: 140,
        sortValue: (person) => person.edited,
        render: (person) => React.createElement("span", null, formatNumber(person.edited)),
    },
    {
        key: "unpublished",
        header: CONTENT.columns.unpublished,
        minWidth: 130,
        sortValue: (person) => person.unpublished,
        render: (person) => (React.createElement(Badge, { label: formatNumber(person.unpublished), tone: person.unpublished > 0 ? "warning" : "neutral", showIcon: false })),
    },
    {
        key: "stale",
        header: CONTENT.columns.stale,
        minWidth: 110,
        sortValue: (person) => person.stale,
        render: (person) => React.createElement("span", null, formatNumber(person.stale)),
    },
    {
        key: "lists",
        header: CONTENT.columns.lists,
        minWidth: 220,
        sortValue: (person) => person.lists.length,
        filterValue: (person) => { var _a; return (_a = person.lists[0]) !== null && _a !== void 0 ? _a : "-"; },
        render: (person) => React.createElement("span", { title: person.lists.join(", ") }, person.lists.join(", ") || "-"),
    },
    {
        key: "lastEdit",
        header: CONTENT.columns.lastEdit,
        minWidth: 150,
        sortValue: (person) => person.lastEdit,
        render: (person) => React.createElement("span", null, person.lastEdit ? formatDate(person.lastEdit) : "-"),
    },
];
export const PeopleTab = ({ people, onSelect }) => {
    if (people.length === 0) {
        return React.createElement(EmptyState, { title: CONTENT.title, description: CONTENT.empty, iconName: "People" });
    }
    return (React.createElement(Table, { ariaLabel: CONTENT.title, rows: people, columns: peopleColumns, getRowKey: (person) => person.name, onRowClick: onSelect, initialSortKey: "touched", initialSortDescending: true, searchValue: (person) => `${person.name} ${person.lists.join(" ")}`, searchLabel: CONTENT.title }));
};
//# sourceMappingURL=People.tab.js.map