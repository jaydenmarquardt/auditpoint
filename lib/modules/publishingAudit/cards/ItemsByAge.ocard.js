import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsByAgeCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.staleness, info: PublishingAuditContent.cardInfo.staleness, defaultChart: "donut", charts: ["donut", "hbar", "donut"], points: view.stalenessSplit, previewCount: 14 }));
//# sourceMappingURL=ItemsByAge.ocard.js.map