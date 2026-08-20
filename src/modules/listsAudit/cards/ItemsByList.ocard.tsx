import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { ListsAuditContent } from "@/modules/listsAudit/ListsAudit.content";
import { ListsAuditView } from "@/modules/listsAudit/ListsAudit.types";

export const ItemsByListCard: React.FC<{ view: ListsAuditView }> = ({ view }) => (
  <ChartCard
    title={ListsAuditContent.charts.largestItems}
    info={ListsAuditContent.cardInfo.largestItems}
    points={view.largestByItems.map((list) => ({ label: list.title, value: list.itemCount }))}
    charts={["hbar", "bar"]}
  />
);
