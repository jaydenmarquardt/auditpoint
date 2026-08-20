import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsModifiedByMonthCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.modified, info: PublishingAuditContent.cardInfo.modified, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.modifiedByMonth, previewCount: 14 }));
//# sourceMappingURL=ItemsModifiedByMonth.ocard.js.map