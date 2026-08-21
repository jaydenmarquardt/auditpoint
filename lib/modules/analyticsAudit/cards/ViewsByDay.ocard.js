import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByDayCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByDay, info: AnalyticsAuditContent.cardInfo.viewsByDay, defaultChart: "bar", charts: ["bar", "hbar", "donut"], span: 2, points: view.viewsByDay }));
//# sourceMappingURL=ViewsByDay.ocard.js.map