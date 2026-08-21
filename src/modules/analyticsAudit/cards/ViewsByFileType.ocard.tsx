import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const ViewsByFileTypeCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.viewsByFileType}
    info={AnalyticsAuditContent.cardInfo.viewsByFileType}
    defaultChart="donut"
    charts={["donut", "hbar", "donut"]}
    points={view.viewsByFileType}
  />
);
