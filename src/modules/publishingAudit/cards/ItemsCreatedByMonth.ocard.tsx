import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsCreatedByMonthCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.created}
    info={PublishingAuditContent.cardInfo.created}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.createdByMonth}
    previewCount={14}
  />
);
