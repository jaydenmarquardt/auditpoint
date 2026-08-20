import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { WebPartAuditContent } from "@/modules/webPartAudit/WebPartAudit.content";
import { WebPartAuditView } from "@/modules/webPartAudit/WebPartAudit.types";

export const PagesByLayoutCard: React.FC<{ view: WebPartAuditView }> = ({ view }) => (
  <ChartCard
    title={WebPartAuditContent.charts.layouts}
    info={WebPartAuditContent.cardInfo.layouts}
    points={view.layoutSplit.map((entry) => ({ label: entry.label, value: entry.value }))}
    charts={["hbar", "donut", "bar"]}
  />
);
