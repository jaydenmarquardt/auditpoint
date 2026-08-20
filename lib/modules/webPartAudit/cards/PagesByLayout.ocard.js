import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { WebPartAuditContent } from "../WebPartAudit.content";
export const PagesByLayoutCard = ({ view }) => (React.createElement(ChartCard, { title: WebPartAuditContent.charts.layouts, info: WebPartAuditContent.cardInfo.layouts, points: view.layoutSplit.map((entry) => ({ label: entry.label, value: entry.value })), charts: ["hbar", "donut", "bar"] }));
//# sourceMappingURL=PagesByLayout.ocard.js.map