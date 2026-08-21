import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const TopFilesCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.topFiles, info: AnalyticsAuditContent.cardInfo.topFiles, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], span: 2, selectable: false, points: view.topFiles }));
//# sourceMappingURL=TopFiles.ocard.js.map