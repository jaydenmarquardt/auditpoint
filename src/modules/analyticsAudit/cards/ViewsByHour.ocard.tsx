import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const ViewsByHourCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.viewsByHour}
    info={AnalyticsAuditContent.cardInfo.viewsByHour}
    defaultChart="bar"
    charts={["bar", "hbar", "donut"]}
    points={view.viewsByHour}
  />
);
