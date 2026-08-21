import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByOrgUnitCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByOrgUnit, info: AnalyticsAuditContent.cardInfo.viewsByOrgUnit, defaultChart: "donut", charts: ["donut", "hbar", "donut"], points: view.viewsByOrgUnit }));
//# sourceMappingURL=ViewsByOrgUnit.ocard.js.map