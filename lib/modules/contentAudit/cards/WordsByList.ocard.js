import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ContentAuditContent } from "../ContentAudit.content";
export const WordsByListCard = ({ view }) => (React.createElement(ChartCard, { title: ContentAuditContent.charts.list, info: ContentAuditContent.cardInfo.list, defaultChart: "hbar", charts: ["hbar", "donut", "bar"], points: view.wordsByList }));
//# sourceMappingURL=WordsByList.ocard.js.map