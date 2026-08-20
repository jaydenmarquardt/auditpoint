import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ContentAuditContent } from "../ContentAudit.content";
export const HeadingsByLevelCard = ({ view }) => (React.createElement(ChartCard, { title: ContentAuditContent.charts.headings, info: ContentAuditContent.cardInfo.headings, defaultChart: "bar", charts: ["bar", "hbar", "bar"], points: view.headingsByLevel }));
//# sourceMappingURL=HeadingsByLevel.ocard.js.map