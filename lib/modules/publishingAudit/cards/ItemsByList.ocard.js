import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { PublishingAuditContent } from "../PublishingAudit.content";
export const ItemsByListCard = ({ view }) => (React.createElement(ChartCard, { title: PublishingAuditContent.charts.list, info: PublishingAuditContent.cardInfo.list, defaultChart: "hbar", charts: ["hbar", "donut", "bar"], points: view.itemsByList }));
//# sourceMappingURL=ItemsByList.ocard.js.map