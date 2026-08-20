import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const ItemsModifiedByMonthCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.modified}
    info={PublishingAuditContent.cardInfo.modified}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.modifiedByMonth}
    previewCount={14}
  />
);
