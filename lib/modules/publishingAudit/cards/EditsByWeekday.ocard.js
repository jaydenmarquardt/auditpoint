import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const EditsByWeekdayCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.weekday, info: PublishingAuditContent.cardInfo.weekday, defaultChart: "bar", charts: ["bar", "hbar", "donut"], points: view.modifiedByWeekday, previewCount: 14 }));
//# sourceMappingURL=EditsByWeekday.ocard.js.map