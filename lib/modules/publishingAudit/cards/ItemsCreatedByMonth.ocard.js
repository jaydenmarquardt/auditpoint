import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsCreatedByMonthCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.created, info: PublishingAuditContent.cardInfo.created, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.createdByMonth, previewCount: 14 }));
//# sourceMappingURL=ItemsCreatedByMonth.ocard.js.map