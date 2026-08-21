import * as React from "react";
import { Button } from "@/components/actions/Button";
import { TableColumn } from "@/components/Components.types";
import { Theme } from "@/theme/Theme.api";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { formatDuration, windowOf } from "@/modules/analyticsAudit/AnalyticsAudit.logic";
import { AnalyticsEntry, WindowKey } from "@/modules/analyticsAudit/AnalyticsAudit.types";
import { formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export function entryColumns(activeWindow: WindowKey): TableColumn<AnalyticsEntry>[] {
  const measure = (entry: AnalyticsEntry): { views: number; unique: number; timeSpentSeconds: number } =>
    windowOf(entry, activeWindow);

  return [
    {
      key: "title",
      header: AnalyticsAuditContent.columns.title,
      minWidth: 260,
      maxWidth: 380,
      sortValue: (entry) => entry.title,
      render: (entry) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{entry.title}</div>
          <div style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted, wordBreak: "break-all" }}>
            {entry.url}
          </div>
        </div>
      ),
    },
    {
      key: "list",
      header: AnalyticsAuditContent.columns.list,
      minWidth: 160,
      sortValue: (entry) => entry.listTitle,
      filterValue: (entry) => entry.listTitle,
      render: (entry) => <span>{entry.listTitle}</span>,
    },
    {
      key: "folder",
      header: AnalyticsAuditContent.columns.folder,
      minWidth: 160,
      sortValue: (entry) => entry.folder,
      filterValue: (entry) => entry.folder || "(root)",
      render: (entry) => <span>{entry.folder || "(root)"}</span>,
    },
    {
      key: "orgUnit",
      header: AnalyticsAuditContent.columns.orgUnit,
      minWidth: 160,
      sortValue: (entry) => entry.orgUnit,
      filterValue: (entry) => entry.orgUnit || "-",
      render: (entry) => <span>{entry.orgUnit || "-"}</span>,
    },
    {
      key: "views",
      header: AnalyticsAuditContent.columns.views,
      minWidth: 110,
      sortValue: (entry) => measure(entry).views,
      render: (entry) => <span>{formatNumber(measure(entry).views)}</span>,
    },
    {
      key: "unique",
      header: AnalyticsAuditContent.columns.unique,
      minWidth: 110,
      sortValue: (entry) => measure(entry).unique,
      render: (entry) => <span>{formatNumber(measure(entry).unique)}</span>,
    },
    {
      key: "time",
      header: AnalyticsAuditContent.columns.time,
      minWidth: 120,
      sortValue: (entry) => measure(entry).timeSpentSeconds,
      render: (entry) => <span>{formatDuration(measure(entry).timeSpentSeconds)}</span>,
    },
    {
      key: "perView",
      header: AnalyticsAuditContent.columns.perView,
      minWidth: 110,
      sortValue: (entry) => (measure(entry).views === 0 ? 0 : measure(entry).timeSpentSeconds / measure(entry).views),
      render: (entry) => (
        <span>
          {measure(entry).views === 0
            ? "-"
            : formatDuration(Math.round(measure(entry).timeSpentSeconds / measure(entry).views))}
        </span>
      ),
    },
    {
      key: "modified",
      header: AnalyticsAuditContent.columns.modified,
      minWidth: 140,
      sortValue: (entry) => entry.modified,
      render: (entry) => <span>{entry.modified ? formatDate(entry.modified) : "-"}</span>,
    },
    {
      key: "open",
      header: AnalyticsAuditContent.columns.open,
      minWidth: 110,
      render: (entry) => (
        <Button
          label={AnalyticsAuditContent.columns.open}
          variant="subtle"
          iconName="OpenInNewWindow"
          newTab
          href={absoluteFromServerRelative(entry.url, entry.siteUrl || window.location.href)}
        />
      ),
    },
  ];
}
