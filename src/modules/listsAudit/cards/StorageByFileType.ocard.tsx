import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";
import { formatBytes } from "@/utils/Format.util";

export const StorageByFileTypeCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.extensionSize}
    info={ListsAuditContent.cardInfo.extensionSize}
    defaultChart="donut"
    charts={["donut", "hbar"]}
    valueFormatter={formatBytes}
    emptyLabel={ListsAuditContent.storageUnavailableShort}
    points={view.byExtensionSize.map((entry) => ({ label: entry.label, value: entry.value }))}
  />
);
