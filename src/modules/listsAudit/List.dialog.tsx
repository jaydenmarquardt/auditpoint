import * as React from "react";
import { PreviewDialog } from "@/components/actions/PreviewDialog";
import { Button } from "@/components/actions/Button";
import { Badge } from "@/components/feedback/Badge";
import { StatTile } from "@/components/layout/StatTile";
import { Tabs } from "@/components/data/Tabs";
import { ChartCard } from "@/components/charts/ChartCard";
import { EmptyState } from "@/components/states/Empty.state";
import { Theme } from "@/theme/Theme.api";
import { SiteList } from "@/api/Lists.types";
import { SiteLists } from "@/api/Lists.api";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { daysSince, extensionLabel } from "@/modules/listsAudit/ListsAudit.logic";
import { ContentTypesCard } from "@/modules/listsAudit/cards/ContentTypes.ocard";
import { formatBytes, formatDate, formatNumber } from "@/utils/Format.util";
import { absoluteFromServerRelative } from "@/utils/Url.util";

export interface ListDialogProps {
  list?: SiteList;
  onDismiss: () => void;
}

export const ListDialog: React.FC<ListDialogProps> = ({ list, onDismiss }) => {
  const [tab, setTab] = React.useState("summary");
  if (!list) return null;

  const site = list.siteUrl ?? window.location.origin;
  const isLibrary = list.kind === "library";
  const extensions = Object.entries(list.extensions ?? {})
    .map(([extension, stat]) => ({ label: extensionLabel(extension), count: stat.count, bytes: stat.bytes }))
    .sort((a, b) => b.count - a.count);

  const averageFileBytes =
    list.fileCount && list.storageBytes ? Math.round(list.storageBytes / list.fileCount) : undefined;

  return (
    <PreviewDialog
      open={Boolean(list)}
      onDismiss={onDismiss}
      title={list.title}
      description={list.description || list.serverRelativeUrl}
      actions={
        <>
          <Button
            label={ListsAuditContent.openSettings}
            iconName="Settings"
            onClick={() => window.open(SiteLists(list.siteUrl).settingsUrl(list), "_blank", "noopener")}
          />
          <Button
            label={ListsAuditContent.openList}
            iconName="OpenInNewWindow"
            onClick={() =>
              window.open(
                list.defaultViewUrl ? absoluteFromServerRelative(list.defaultViewUrl, site) : site,
                "_blank",
                "noopener"
              )
            }
          />
          <Button label={ListsAuditContent.dialog.close} variant="primary" onClick={onDismiss} />
        </>
      }
    >
      <Tabs
        ariaLabel={list.title}
        selectedKey={tab}
        onChange={setTab}
        items={[
          {
            key: "summary",
            label: ListsAuditContent.dialog.tabSummary,
            content: (
              <div style={{ display: "grid", gap: Theme.tokens.space.lg }}>
                <div style={{ display: "flex", gap: Theme.tokens.space.md, flexWrap: "wrap" }}>
                  <StatTile label={ListsAuditContent.columns.items} value={formatNumber(list.itemCount)} />
                  <StatTile
                    label={ListsAuditContent.columns.folders}
                    value={list.folderCount === undefined ? "-" : formatNumber(list.folderCount)}
                  />
                  <StatTile
                    label={ListsAuditContent.columns.files}
                    value={isLibrary && list.fileCount !== undefined ? formatNumber(list.fileCount) : "-"}
                  />
                  <StatTile
                    label={ListsAuditContent.stats.storage}
                    value={isLibrary && list.storageBytes !== undefined ? formatBytes(list.storageBytes) : "-"}
                    hint={
                      averageFileBytes && isLibrary
                        ? `${formatBytes(averageFileBytes)} ${ListsAuditContent.dialog.perFile}`
                        : undefined
                    }
                  />
                  <StatTile
                    label={ListsAuditContent.columns.modified}
                    value={formatDate(list.lastItemModified)}
                    hint={`${daysSince(list.lastItemModified)} ${ListsAuditContent.dialog.daysAgo}`}
                  />
                  <StatTile
                    label={ListsAuditContent.columns.contentTypes}
                    value={formatNumber((list.contentTypes ?? []).length)}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                    gap: Theme.tokens.space.md,
                  }}
                >
                  <ContentTypesCard contentTypes={list.contentTypes ?? []} itemCount={list.itemCount} />
                </div>
              </div>
            ),
          },
          {
            key: "configuration",
            label: ListsAuditContent.dialog.tabConfiguration,
            content: (
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                  gap: Theme.tokens.space.md,
                  margin: 0,
                }}
              >
                <Fact label={ListsAuditContent.columns.template} value={list.templateName} />
                <Fact label={ListsAuditContent.dialog.created} value={formatDate(list.created)} />
                <Fact
                  label={ListsAuditContent.columns.versioning}
                  value={
                    <Badge
                      label={list.versioningEnabled ? ListsAuditContent.on : ListsAuditContent.off}
                      tone={list.versioningEnabled ? "success" : "warning"}
                    />
                  }
                />
                <Fact
                  label={ListsAuditContent.dialog.versionLimit}
                  value={
                    list.majorVersionLimit ? formatNumber(list.majorVersionLimit) : ListsAuditContent.dialog.unlimited
                  }
                />
                <Fact
                  label={ListsAuditContent.columns.permissions}
                  value={
                    <Badge
                      label={list.hasUniquePermissions ? ListsAuditContent.unique : ListsAuditContent.inherited}
                      tone={list.hasUniquePermissions ? "warning" : "neutral"}
                    />
                  }
                />
                <Fact
                  label={ListsAuditContent.columns.visibility}
                  value={
                    <Badge
                      label={list.hidden ? ListsAuditContent.hidden : ListsAuditContent.visible}
                      tone={list.hidden ? "warning" : "neutral"}
                    />
                  }
                />
                <Fact
                  label={ListsAuditContent.dialog.contentTypesOn}
                  value={list.contentTypesEnabled ? ListsAuditContent.on : ListsAuditContent.off}
                />
                <Fact
                  label={ListsAuditContent.dialog.scanTitle}
                  value={
                    list.scannedItems === undefined
                      ? ListsAuditContent.dialog.notScanned
                      : `${formatNumber(list.scannedItems)} ${ListsAuditContent.dialog.itemsScanned}${
                          list.scanTruncated ? ` ${ListsAuditContent.dialog.capped}` : ""
                        }`
                  }
                />
                <Fact label={ListsAuditContent.dialog.url} value={<code>{list.serverRelativeUrl}</code>} />
              </dl>
            ),
          },
          {
            key: "files",
            label: ListsAuditContent.dialog.tabFiles,
            content: !isLibrary ? (
              <EmptyState
                title={ListsAuditContent.dialog.filesOnlyTitle}
                description={ListsAuditContent.dialog.filesOnly}
                iconName="Page"
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
                  gap: Theme.tokens.space.md,
                }}
              >
                <ChartCard
                  title={ListsAuditContent.charts.extensions}
                  info={ListsAuditContent.cardInfo.extensions}
                  points={extensions.map((entry) => ({ label: entry.label, value: entry.count }))}
                  charts={["hbar", "donut"]}
                  emptyLabel={ListsAuditContent.dialog.noFiles}
                />
                <ChartCard
                  title={ListsAuditContent.charts.extensionSize}
                  info={ListsAuditContent.cardInfo.extensionSize}
                  defaultChart="donut"
                  charts={["donut", "hbar"]}
                  valueFormatter={formatBytes}
                  points={extensions.map((entry) => ({ label: entry.label, value: entry.bytes }))}
                  emptyLabel={ListsAuditContent.dialog.noFiles}
                />
              </div>
            ),
          },
        ]}
      />
    </PreviewDialog>
  );
};

const Fact: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ minWidth: 0 }}>
    <dt style={{ fontSize: Theme.tokens.font.sm, color: Theme.palette().textMuted }}>{label}</dt>
    <dd style={{ margin: "2px 0 0", fontWeight: 600, wordBreak: "break-word" }}>{value}</dd>
  </div>
);
