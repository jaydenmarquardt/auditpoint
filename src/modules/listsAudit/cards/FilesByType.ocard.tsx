import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";

export const FilesByTypeCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.extensions}
    info={ListsAuditContent.cardInfo.extensions}
    points={view.byExtension.map((entry) => ({ label: entry.label, value: entry.value }))}
    charts={["hbar", "donut", "bar"]}
  />
);
