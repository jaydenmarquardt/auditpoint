import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { AnalyticsAuditContent } from "../AnalyticsAudit.content";
export const ViewsByFolderCard = ({ view }) => (React.createElement(ChartCard, { title: AnalyticsAuditContent.charts.viewsByFolder, info: AnalyticsAuditContent.cardInfo.viewsByFolder, defaultChart: "hbar", charts: ["hbar", "hbar", "donut"], span: 2, selectable: false, points: view.viewsByFolder }));
//# sourceMappingURL=ViewsByFolder.ocard.js.map