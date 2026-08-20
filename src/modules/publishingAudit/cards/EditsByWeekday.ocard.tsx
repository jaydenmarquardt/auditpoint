import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { PublishingAuditContent } from "@/modules/publishingAudit/PublishingAudit.content";
import { PublishingAuditView } from "@/modules/publishingAudit/PublishingAudit.types";

export const EditsByWeekdayCard: React.FC<{ view: PublishingAuditView }> = ({ view }) => (
  <ChartCard
    title={PublishingAuditContent.charts.weekday}
    info={PublishingAuditContent.cardInfo.weekday}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.modifiedByWeekday}
    previewCount={14}
  />
);
