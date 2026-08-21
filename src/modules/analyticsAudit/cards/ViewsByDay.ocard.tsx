import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const ViewsByDayCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.viewsByDay}
    info={AnalyticsAuditContent.cardInfo.viewsByDay}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    span={2}
    points={view.viewsByDay}
  />
);
