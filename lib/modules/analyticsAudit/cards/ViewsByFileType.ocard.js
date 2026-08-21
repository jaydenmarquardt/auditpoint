import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByFileTypeCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByFileType, info: AnalyticsAuditContent.cardInfo.viewsByFileType, defaultChart: "donut", charts: ["donut", "hbar", "donut"], points: view.viewsByFileType }));
//# sourceMappingURL=ViewsByFileType.ocard.js.map