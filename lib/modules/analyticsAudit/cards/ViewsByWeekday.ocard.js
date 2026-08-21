import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByWeekdayCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByWeekday, info: AnalyticsAuditContent.cardInfo.viewsByWeekday, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.viewsByWeekday }));
//# sourceMappingURL=ViewsByWeekday.ocard.js.map