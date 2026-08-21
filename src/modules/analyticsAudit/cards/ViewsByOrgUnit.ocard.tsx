import * as React from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { AnalyticsAuditContent } from "@/modules/analyticsAudit/AnalyticsAudit.content";
import { AnalyticsAuditView } from "@/modules/analyticsAudit/AnalyticsAudit.types";

export const ViewsByOrgUnitCard: React.FC<{ view: AnalyticsAuditView }> = ({ view }) => (
  <ChartCard
    title={AnalyticsAuditContent.charts.viewsByOrgUnit}
    info={AnalyticsAuditContent.cardInfo.viewsByOrgUnit}
    defaultChart="donut"
    charts={["donut", "hbar", "donut"]}
    points={view.viewsByOrgUnit}
  />
);
