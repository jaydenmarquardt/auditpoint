import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsByListCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.list}
    info={PublishingAuditContent.cardInfo.list}
    defaultChart="hbar"
    charts={["hbar", "donut", "bar"]}
    span={2}
    points={view.itemsByList}
  />
);
