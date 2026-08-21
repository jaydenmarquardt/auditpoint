import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByHourCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByHour, info: AnalyticsAuditContent.cardInfo.viewsByHour, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.viewsByHour }));
//# sourceMappingURL=ViewsByHour.ocard.js.map