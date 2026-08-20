import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { IndexingAuditContent } from "../IndexingAudit.content";
export const CoverageByListCard = ({ view }) => (React.createElement(ChartCard, { title: IndexingAuditContent.charts.coverage, info: IndexingAuditContent.cardInfo.coverage, points: view.coverageByList, charts: ["hbar", "bar"], valueFormatter: (value) => `${value}%`, emptyLabel: IndexingAuditContent.coverageOff }));
//# sourceMappingURL=CoverageByList.ocard.js.map