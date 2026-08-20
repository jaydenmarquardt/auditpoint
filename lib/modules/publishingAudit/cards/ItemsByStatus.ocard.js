import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsByStatusCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.status, info: PublishingAuditContent.cardInfo.status, defaultChart: "donut", charts: ["donut", "hbar", "donut"], points: view.statusSplit, previewCount: 14 }));
//# sourceMappingURL=ItemsByStatus.ocard.js.map