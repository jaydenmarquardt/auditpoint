import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const TopPagesCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.topPages}
    info={AnalyticsAuditContent.cardInfo.topPages}
    defaultChart="hbar"
    charts={["hbar", "hbar", "donut"]}
    span={2}
    selectable={false}
    points={view.topPages}
  />
);
