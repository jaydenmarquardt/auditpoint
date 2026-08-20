import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { IndexingAuditContent } from "../IndexingAudit.content";
export const IndexedByListCard = ({ view }) => (React.createElement(ChartCard, { title: IndexingAuditContent.charts.indexed, info: IndexingAuditContent.cardInfo.indexed, points: view.indexedByList, charts: ["hbar", "bar", "donut"], emptyLabel: IndexingAuditContent.coverageOff }));
//# sourceMappingURL=IndexedByList.ocard.js.map