import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";
import { formatBytes } from "@/utils/Format.util";

export const StorageByListCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.largest}
    info={ListsAuditContent.cardInfo.largest}
    valueFormatter={formatBytes}
    emptyLabel={ListsAuditContent.storageUnavailableShort}
    span={2}
    selectable={false}
    points={view.largest.map((list) => ({ label: list.title, value: list.storageBytes ?? 0 }))}
    charts={["hbar", "donut"]}
  />
);
