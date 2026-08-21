import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const ViewersByDayCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.viewersByDay}
    info={AnalyticsAuditContent.cardInfo.viewersByDay}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.viewersByDay}
  />
);
