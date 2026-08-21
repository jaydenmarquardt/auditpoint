import * as React from "react";
import { Table } from "@/components/data/Table";
import { Badge } from "@/components/feedback/Badge";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingPerson } from "@/modules/publishingAudit/PublishingAudit.types";
import { formatDate, formatNumber } from "@/utils/Format.util";

const CONTENT = PublishingAuditContent.people;

export const peopleColumns: TableColumn<PublishingPerson>[] = [
  {
    key: "name",
    header: CONTENT.columns.name,
    minWidth: 220,
    maxWidth: 320,
    sortValue: (person) => person.name,
    render: (person) => <span style={{ fontWeight: 600 }}>{person.name}</span>,
  },
  {
    key: "touched",
    header: CONTENT.columns.touched,
    minWidth: 110,
    sortValue: (person) => person.items.length,
    render: (person) => <span>{formatNumber(person.items.length)}</span>,
  },
  {
    key: "created",
    header: CONTENT.columns.created,
    minWidth: 110,
    sortValue: (person) => person.created,
    render: (person) => <span>{formatNumber(person.created)}</span>,
  },
  {
    key: "edited",
    header: CONTENT.columns.edited,
    minWidth: 140,
    sortValue: (person) => person.edited,
    render: (person) => <span>{formatNumber(person.edited)}</span>,
  },
  {
    key: "unpublished",
    header: CONTENT.columns.unpublished,
    minWidth: 130,
    sortValue: (person) => person.unpublished,
    render: (person) => (
      <Badge
        label={formatNumber(person.unpublished)}
        tone={person.unpublished > 0 ? "warning" : "neutral"}
        showIcon={false}
      />
    ),
  },
  {
    key: "stale",
    header: CONTENT.columns.stale,
    minWidth: 110,
    sortValue: (person) => person.stale,
    render: (person) => <span>{formatNumber(person.stale)}</span>,
  },
  {
    key: "lists",
    header: CONTENT.columns.lists,
    minWidth: 220,
    sortValue: (person) => person.lists.length,
    filterValue: (person) => person.lists[0] ?? "-",
    render: (person) => <span title={person.lists.join(", ")}>{person.lists.join(", ") || "-"}</span>,
  },
  {
    key: "lastEdit",
    header: CONTENT.columns.lastEdit,
    minWidth: 150,
    sortValue: (person) => person.lastEdit,
    render: (person) => <span>{person.lastEdit ? formatDate(person.lastEdit) : "-"}</span>,
  },
];

export const PeopleTab: React.FC<{
  people: PublishingPerson[];
  onSelect: (person: PublishingPerson) => void;
}> = ({ people, onSelect }) => {
  if (people.length === 0) {
    return <EmptyState title={CONTENT.title} description={CONTENT.empty} iconName="People" />;
  }

  return (
    <Table
      ariaLabel={CONTENT.title}
      rows={people}
      columns={peopleColumns}
      getRowKey={(person) => person.name}
      onRowClick={onSelect}
      initialSortKey="touched"
      initialSortDescending
      searchValue={(person) => `${person.name} ${person.lists.join(" ")}`}
      searchLabel={CONTENT.title}
    />
  );
};
