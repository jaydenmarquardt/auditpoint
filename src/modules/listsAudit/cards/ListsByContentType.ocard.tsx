import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";

export const ListsByContentTypeCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.contentTypes}
    info={ListsAuditContent.cardInfo.contentTypes}
    points={view.byContentType.map((entry) => ({ label: entry.label, value: entry.value }))}
    charts={["hbar", "bar", "donut"]}
  />
);
