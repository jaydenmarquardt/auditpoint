import * as React from "react";
import { Table } from "@/components/data/Table";
import { Button } from "@/components/actions/Button";
import { EmptyState } from "@/components/states/Empty.state";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { BrokenItem } from "@/api/SitePermissions.types";
import { PermissionsAuditContent } from "@/modules/permissionsAudit/PermissionsAudit.content";
import { absoluteFromServerRelative } from "@/utils/Url.util";

const columns: TableColumn<BrokenItem>[] = [
  {
    key: "title",
    header: PermissionsAuditContent.columns.item,
    minWidth: 300,
    maxWidth: 420,
    sortValue: (item) => item.title,
    render: (item) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
        <div
          style={{
            fontSize: Theme.tokens.font.sm,
            color: Theme.palette().textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.url}
        </div>
      </div>
    ),
  },
  {
    key: "list",
    header: PermissionsAuditContent.columns.list,
    minWidth: 220,
    sortValue: (item) => item.listTitle,
    filterValue: (item) => item.listTitle,
    render: (item) => <span>{item.listTitle}</span>,
  },
  {
    key: "actions",
    header: PermissionsAuditContent.columns.actions,
    minWidth: 130,
    render: (item) =>
      item.url ? (
        <Button
          label={PermissionsAuditContent.openItem}
          variant="subtle"
          iconName="OpenInNewWindow"
          href={absoluteFromServerRelative(item.url, item.siteUrl || window.location.href)}
        />
      ) : (
        <span style={{ color: Theme.palette().textMuted }}>-</span>
      ),
  },
];

export const BrokenItemsTab: React.FC<{ items: BrokenItem[]; enabled: boolean }> = ({ items, enabled }) => {
  if (!enabled) {
    return (
      <EmptyState
        title={PermissionsAuditContent.itemsOff}
        description={PermissionsAuditContent.itemsOffHint}
        iconName="Permissions"
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={PermissionsAuditContent.noBrokenItems}
        description={PermissionsAuditContent.noBrokenItemsHint}
        iconName="CheckMark"
      />
    );
  }

  return (
    <Table
      ariaLabel={PermissionsAuditContent.tabs.items}
      rows={items}
      columns={columns}
      getRowKey={(item) => `${item.siteUrl}-${item.listTitle}-${item.itemId}`}
      initialSortKey="list"
      searchValue={(item) => `${item.title} ${item.url} ${item.listTitle}`}
      searchLabel={PermissionsAuditContent.search.items}
    />
  );
};
