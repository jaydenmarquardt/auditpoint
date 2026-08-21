import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewersByDayCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewersByDay, info: AnalyticsAuditContent.cardInfo.viewersByDay, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.viewersByDay }));
//# sourceMappingURL=ViewersByDay.ocard.js.map