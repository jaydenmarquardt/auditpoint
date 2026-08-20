import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";

export const ListsByTemplateCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.byTemplate}
    info={ListsAuditContent.cardInfo.templates}
    points={view.byTemplate.map((entry) => ({ label: entry.label, value: entry.value }))}
    charts={["hbar", "bar", "donut"]}
  />
);
