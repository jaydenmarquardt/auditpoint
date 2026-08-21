import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const TimeByFolderCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.timeByFolder, info: AnalyticsAuditContent.cardInfo.timeByFolder, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], span: 2, selectable: false, points: view.timeByFolder }));
//# sourceMappingURL=TimeByFolder.ocard.js.map