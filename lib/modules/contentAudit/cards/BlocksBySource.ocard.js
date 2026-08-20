import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ContentAuditContent } from "../ContentAudit.content";
export const BlocksBySourceCard = ({ view }) => (React.createElement(ChartCard, { title: ContentAuditContent.charts.source, info: ContentAuditContent.cardInfo.source, defaultChart: "donut", charts: ["donut", "hbar", "bar"], points: view.sourceSplit }));
//# sourceMappingURL=BlocksBySource.ocard.js.map