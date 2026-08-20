import * as React from "react";
import { ChartCard } from "../../../components/charts/ChartCard";
import { ListsAuditContent } from "../ListsAudit.content";
export const FilesByTypeCard = ({ view }) => (React.createElement(ChartCard, { title: ListsAuditContent.charts.extensions, info: ListsAuditContent.cardInfo.extensions, points: view.byExtension.map((entry) => ({ label: entry.label, value: entry.value })), charts: ["hbar", "donut", "bar"] }));
//# sourceMappingURL=FilesByType.ocard.js.map