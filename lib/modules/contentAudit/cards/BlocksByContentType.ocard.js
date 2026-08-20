import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ContentAuditContent } from "../ContentAudit.content";
export const BlocksByContentTypeCard = ({ view }) => (React.createElement(ChartCard, { title: ContentAuditContent.charts.contentType, info: ContentAuditContent.cardInfo.contentType, defaultChart: "hbar", charts: ["hbar", "donut", "bar"], points: view.byContentType }));
//# sourceMappingURL=BlocksByContentType.ocard.js.map