import * as React from "react";
import { Badge } from "@/components/feedback/Badge";
import { IconButton } from "@/components/actions/IconButton";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { SiteList } from "@/api/Lists.types";
import { SiteLists } from "@/api/Lists.api";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { daysSince } from "@/modules/listsAudit/ListsAudit.logic";
import { formatBytes, formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export function listColumns(onSelect: (list: SiteList) => void): TableColumn<SiteList>[] {
  return [
    {
      key: "title",
      header: ListsAuditContent.columns.title,
      minWidth: 220,
      maxWidth: 320,
      sortValue: (list) => list.title,
      render: (list) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{list.title}</div>
          <div
            style={{
              fontSize: Theme.tokens.font.sm,
              color: Theme.palette().textMuted,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {list.serverRelativeUrl}
          </div>
        </div>
      ),
    },
    {
      key: "template",
      header: ListsAuditContent.columns.template,
      minWidth: 150,
      sortValue: (list) => list.templateName,
      filterValue: (list) => list.templateName,
      render: (list) => (
        <Badge label={list.templateName} tone={list.kind === "library" ? "info" : "neutral"} showIcon={false} />
      ),
    },
    {
      key: "visibility",
      header: ListsAuditContent.columns.visibility,
      minWidth: 120,
      sortValue: (list) => (list.hidden ? 1 : 0),
      filterValue: (list) => (list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible),
      render: (list) => (
        <Badge
          label={list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible}
          tone={list.hidden ? "warning" : "neutral"}
        />
      ),
    },
    {
      key: "items",
      header: ListsAuditContent.columns.items,
      minWidth: 100,
      sortValue: (list) => list.itemCount,
      render: (list) => <span>{formatNumber(list.itemCount)}</span>,
    },
    {
      key: "folders",
      header: ListsAuditContent.columns.folders,
      minWidth: 100,
      sortValue: (list) => list.folderCount ?? -1,
      render: (list) => <span>{list.folderCount === undefined ? "-" : formatNumber(list.folderCount)}</span>,
    },
    {
      key: "files",
      header: ListsAuditContent.columns.files,
      minWidth: 100,
      sortValue: (list) => list.fileCount ?? -1,
      render: (list) => <span>{list.fileCount === undefined ? "-" : formatNumber(list.fileCount)}</span>,
    },
    {
      key: "storage",
      header: ListsAuditContent.columns.storage,
      minWidth: 110,
      sortValue: (list) => list.storageBytes ?? -1,
      render: (list) => <span>{list.storageBytes === undefined ? "-" : formatBytes(list.storageBytes)}</span>,
    },
    {
      key: "contentTypes",
      header: ListsAuditContent.columns.contentTypes,
      minWidth: 180,
      maxWidth: 260,
      sortValue: (list) => (list.contentTypes ?? []).length,
      render: (list) => (
        <span style={{ color: Theme.palette().textMuted }}>{(list.contentTypes ?? []).join(", ") || "-"}</span>
      ),
    },
    {
      key: "modified",
      header: ListsAuditContent.columns.modified,
      minWidth: 170,
      sortValue: (list) => list.lastItemModified,
      render: (list) => (
        <span>
          {formatDate(list.lastItemModified)}
          <span style={{ color: Theme.palette().textMuted }}> · {daysSince(list.lastItemModified)}d</span>
        </span>
      ),
    },
    {
      key: "versioning",
      header: ListsAuditContent.columns.versioning,
      minWidth: 120,
      sortValue: (list) => (list.versioningEnabled ? 1 : 0),
      filterValue: (list) => (list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off),
      render: (list) => (
        <Badge
          label={list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off}
          tone={list.versioningEnabled ? "success" : "warning"}
        />
      ),
    },
    {
      key: "permissions",
      header: ListsAuditContent.columns.permissions,
      minWidth: 130,
      sortValue: (list) => (list.hasUniquePermissions ? 1 : 0),
      filterValue: (list) => (list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited),
      render: (list) => (
        <Badge
          label={list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited}
          tone={list.hasUniquePermissions ? "warning" : "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: ListsAuditContent.columns.actions,
      minWidth: 130,
      render: (list) => (
        <div style={{ display: "flex", gap: 2 }}>
          <IconButton
            iconName="Info"
            ariaLabel={`${ListsAuditContent.details}: ${list.title}`}
            tooltip={ListsAuditContent.details}
            onClick={() => onSelect(list)}
          />
          <IconButton
            iconName="Settings"
            ariaLabel={`${ListsAuditContent.openSettings}: ${list.title}`}
            tooltip={ListsAuditContent.openSettings}
            onClick={() => window.open(SiteLists(list.siteUrl).settingsUrl(list), "_blank", "noopener")}
          />
          <IconButton
            iconName="OpenInNewWindow"
            ariaLabel={`${ListsAuditContent.openList}: ${list.title}`}
            tooltip={ListsAuditContent.openList}
            onClick={() =>
              window.open(
                list.defaultViewUrl
                  ? absoluteFromServerRelative(list.defaultViewUrl, list.siteUrl ?? window.location.href)
                  : list.siteUrl ?? "",
                "_blank",
                "noopener"
              )
            }
          />
        </div>
      ),
    },
  ];
}
