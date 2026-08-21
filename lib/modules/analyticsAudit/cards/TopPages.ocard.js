import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const TopPagesCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.topPages, info: AnalyticsAuditContent.cardInfo.topPages, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], span: 2, selectable: false, points: view.topPages }));
//# sourceMappingURL=TopPages.ocard.js.map